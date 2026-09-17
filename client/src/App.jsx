import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import TeamList from './components/TeamList';
import TaskModal from './components/TaskModal';
import AddUserModal from './components/AddUserModal';
import CreateProjectModal from './components/CreateProjectModal';
import {
  fetchTasks,
  fetchProjects,
  fetchUsers,
  fetchWorkload,
  createTask,
  updateTask,
  deleteTask,
  createProject,
  createUser,
  addUserToProject
} from './services/api';
import './App.css';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const [users, setUsers] = useState([]);

  // UI Filter & Search state
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);

  // Status & Error handling state
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Initial Data Load (Projects & Users)
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const [projectsData, usersData] = await Promise.all([
        fetchProjects(),
        fetchUsers()
      ]);

      setProjects(projectsData);
      setUsers(usersData);

      if (projectsData.length > 0) {
        setCurrentProjectId(projectsData[0].id);
      }
    } catch (err) {
      console.error('Error loading initial projects/users:', err);
      setErrorMsg('Failed to connect to backend server. Make sure server is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Fetch Tasks & Workload when Project or Priority Filter Changes
  const loadProjectData = useCallback(async () => {
    if (!currentProjectId) return;
    try {
      setErrorMsg(null);
      const [tasksData, workloadData] = await Promise.all([
        fetchTasks(currentProjectId, priorityFilter),
        fetchWorkload(currentProjectId)
      ]);

      setTasks(tasksData);
      setWorkloads(workloadData);
    } catch (err) {
      console.error('Error loading project tasks/workload:', err);
      setErrorMsg('Failed to load tasks from server');
    }
  }, [currentProjectId, priorityFilter]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  // Handle Drag-and-Drop Task Status Change
  const handleTaskStatusChange = async (taskId, newStatus) => {
    // 1. Optimistic UI update for instantaneous fluid drag response
    const previousTasks = [...tasks];
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      // 2. Send API update request to backend / PostgreSQL
      await updateTask(taskId, { status: newStatus });
      // 3. Re-fetch server workload and task state to keep DB as single source of truth
      await loadProjectData();
    } catch (err) {
      console.error('Failed to persist task status update:', err);
      setErrorMsg('Failed to update task status in database');
      // Revert optimistic update on failure
      setTasks(previousTasks);
    }
  };

  // Create or Update Task
  const handleSaveTask = async (taskPayload, editId) => {
    try {
      if (editId) {
        await updateTask(editId, taskPayload);
      } else {
        await createTask(taskPayload);
      }
      setIsTaskModalOpen(false);
      setTaskToEdit(null);
      await loadProjectData();
    } catch (err) {
      console.error('Error saving task:', err);
      alert(`Error: ${err.message || 'Failed to save task'}`);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(taskId);
      await loadProjectData();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task from database');
    }
  };

  // Add Existing User to Project
  const handleAddExistingUser = async (userId, role) => {
    try {
      await addUserToProject(currentProjectId, userId, role);
      setIsAddUserModalOpen(false);
      await loadProjectData();
    } catch (err) {
      console.error('Error adding user to project:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Create New User & Add to Project
  const handleCreateNewUser = async (userData, role) => {
    try {
      const newUser = await createUser(userData);
      await addUserToProject(currentProjectId, newUser.id, role);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      setIsAddUserModalOpen(false);
      await loadProjectData();
    } catch (err) {
      console.error('Error creating new user:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Create New Project
  const handleCreateProject = async (projectData) => {
    try {
      const newProj = await createProject(projectData);
      const updatedProjects = await fetchProjects();
      setProjects(updatedProjects);
      setCurrentProjectId(newProj.id);
      setIsCreateProjectModalOpen(false);
    } catch (err) {
      console.error('Error creating project:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Search filter
  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.assigned_user_name && t.assigned_user_name.toLowerCase().includes(q))
    );
  });

  // Calculate live metrics
  const totalTasksCount = filteredTasks.length;
  const inProgressCount = filteredTasks.filter((t) => t.status === 'in_progress').length;
  const overloadedCount = workloads.filter((u) => u.overloaded).length;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        totalTasksCount={totalTasksCount}
        inProgressCount={inProgressCount}
        overloadedCount={overloadedCount}
      />

      {/* Main Area */}
      <div className="main-content">
        <Header
          projects={projects}
          currentProjectId={currentProjectId}
          onSelectProject={(id) => setCurrentProjectId(id)}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={(p) => setPriorityFilter(p)}
          searchQuery={searchQuery}
          onSearchQueryChange={(q) => setSearchQuery(q)}
          onCreateTaskClick={() => {
            setTaskToEdit(null);
            setIsTaskModalOpen(true);
          }}
          onAddUserClick={() => setIsAddUserModalOpen(true)}
          onCreateProjectClick={() => setIsCreateProjectModalOpen(true)}
        />

        <div className="dashboard-body">
          {errorMsg && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', fontSize: '0.875rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Team Workload & Burnout Alert Banner */}
          <TeamList
            workloads={workloads}
            onAddUserClick={() => setIsAddUserModalOpen(true)}
          />

          {/* Kanban Board Area */}
          {isLoading ? (
            <div className="loading-spinner">Loading Kanban Board...</div>
          ) : (
            <KanbanBoard
              tasks={filteredTasks}
              onTaskStatusChange={handleTaskStatusChange}
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        users={users}
        currentProjectId={currentProjectId}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddExistingUser={handleAddExistingUser}
        onCreateNewUser={handleCreateNewUser}
        existingUsers={users}
        currentProjectId={currentProjectId}
      />

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
