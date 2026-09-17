const API_BASE = '/api';

// Fallback in-memory data store for static frontend deployments (e.g. Vercel static output mode)
const today = new Date().toISOString().split('T')[0];

let localProjects = [
  { id: 1, name: 'TaskFlow Core System', description: 'Main enterprise productivity system architecture and Kanban engine', task_count: 21 },
  { id: 2, name: 'Mobile App Redesign', description: 'Next-gen iOS and Android app UX update with real-time sync', task_count: 0 }
];

let localUsers = [
  { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  { id: 2, name: 'Pranav N J', email: 'pranav@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav' },
  { id: 3, name: 'Anjali Sharma', email: 'anjali@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali' },
  { id: 4, name: 'Sarah Jenkins', email: 'sarah@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 5, name: 'Alex Rivera', email: 'alex@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 6, name: 'Dev Patel', email: 'dev@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev' }
];

let localTasks = [
  // Rahul's 7 In Progress Tasks (OVERLOADED: count > 5)
  { id: 1, project_id: 1, assigned_to: 1, title: 'Optimize Database Queries', description: 'Add indexes and tune slow JOIN queries in PostgreSQL', status: 'in_progress', priority: 'high', due_date: today, assigned_user_name: 'Rahul Kumar', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  { id: 2, project_id: 1, assigned_to: 1, title: 'Implement WebSocket Gateway', description: 'Real-time notifications for task updates and team presence', status: 'in_progress', priority: 'high', due_date: today, assigned_user_name: 'Rahul Kumar', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  { id: 3, project_id: 1, assigned_to: 1, title: 'Fix CORS Policy Header Issue', description: 'Resolve origin mismatches when accessing API from staging subdomains', status: 'in_progress', priority: 'medium', due_date: today, assigned_user_name: 'Rahul Kumar', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  { id: 4, project_id: 1, assigned_to: 1, title: 'Refactor Auth Middleware', description: 'Update JWT validation layer to support token refresh rotation', status: 'in_progress', priority: 'high', due_date: today, assigned_user_name: 'Rahul Kumar', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  { id: 5, project_id: 1, assigned_to: 1, title: 'Draft API Documentation', description: 'Swagger/OpenAPI spec for tasks and workload endpoints', status: 'in_progress', priority: 'low', due_date: today, assigned_user_name: 'Rahul Kumar', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  { id: 6, project_id: 1, assigned_to: 1, title: 'Setup Automated CI Pipeline', description: 'Configure GitHub Actions for automated unit and integration tests', status: 'in_progress', priority: 'medium', due_date: today, assigned_user_name: 'Rahul Kumar', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  { id: 7, project_id: 1, assigned_to: 1, title: 'Security Audit Scan', description: 'Remediation of dependency vulnerabilities reported by Snyk', status: 'in_progress', priority: 'high', due_date: today, assigned_user_name: 'Rahul Kumar', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },

  // Pranav's Tasks
  { id: 8, project_id: 1, assigned_to: 2, title: 'Build Kanban Drag & Drop UI', description: 'Interactive column cards with smooth drop target feedback', status: 'in_progress', priority: 'high', due_date: today, assigned_user_name: 'Pranav N J', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav' },
  { id: 9, project_id: 1, assigned_to: 2, title: 'Integrate Workload Balancing Badge', description: 'Visual status indicators and pulse animation for overloaded team members', status: 'in_progress', priority: 'high', due_date: today, assigned_user_name: 'Pranav N J', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav' },
  { id: 10, project_id: 1, assigned_to: 2, title: 'Design Team List Widget', description: 'Sidebar avatar roster with live task counts', status: 'in_progress', priority: 'medium', due_date: today, assigned_user_name: 'Pranav N J', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav' },
  { id: 11, project_id: 1, assigned_to: 2, title: 'Create Task Modal Dialog', description: 'Rich task creation form with date picker and user dropdown', status: 'todo', priority: 'high', due_date: today, assigned_user_name: 'Pranav N J', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav' },
  { id: 12, project_id: 1, assigned_to: 2, title: 'Filter Tasks by Priority', description: 'Dynamic server-side filtering by low, medium, high priority', status: 'todo', priority: 'medium', due_date: today, assigned_user_name: 'Pranav N J', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav' },
  { id: 13, project_id: 1, assigned_to: 2, title: 'Setup Frontend State Manager', description: 'Optimistic UI updates for immediate drag-and-drop feedback', status: 'done', priority: 'low', due_date: today, assigned_user_name: 'Pranav N J', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav' },

  // Anjali's Tasks
  { id: 14, project_id: 1, assigned_to: 3, title: 'User Permission Schema', description: 'Relational mapping for project roles and granular controls', status: 'in_progress', priority: 'high', due_date: today, assigned_user_name: 'Anjali Sharma', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali' },
  { id: 15, project_id: 1, assigned_to: 3, title: 'Add User to Project Feature', description: 'Modal to invite existing users to current workspace project', status: 'in_progress', priority: 'medium', due_date: today, assigned_user_name: 'Anjali Sharma', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali' },
  { id: 16, project_id: 1, assigned_to: 3, title: 'Export Tasks to CSV', description: 'Allow project managers to generate summary reports', status: 'todo', priority: 'low', due_date: today, assigned_user_name: 'Anjali Sharma', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali' },
  { id: 17, project_id: 1, assigned_to: 3, title: 'Design Token Palette', description: 'HSL colors for dark mode and modern glassmorphism aesthetic', status: 'done', priority: 'medium', due_date: today, assigned_user_name: 'Anjali Sharma', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali' },
  { id: 18, project_id: 1, assigned_to: 3, title: 'Mobile Layout Responsiveness', description: 'Touch-friendly drag controls on tablets and mobile screens', status: 'done', priority: 'low', due_date: today, assigned_user_name: 'Anjali Sharma', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali' },

  // Sarah's Tasks
  { id: 19, project_id: 1, assigned_to: 4, title: 'Performance Benchmarking', description: 'Load testing Express API endpoints under 1,000 concurrent requests', status: 'todo', priority: 'medium', due_date: today, assigned_user_name: 'Sarah Jenkins', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 20, project_id: 1, assigned_to: 4, title: 'Write E2E Cypress Tests', description: 'Automate critical user flows including drag and drop', status: 'todo', priority: 'high', due_date: today, assigned_user_name: 'Sarah Jenkins', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: 21, project_id: 1, assigned_to: 4, title: 'Setup Sentry Error Tracking', description: 'Catch unexpected server-side runtime exceptions', status: 'done', priority: 'low', due_date: today, assigned_user_name: 'Sarah Jenkins', assigned_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
];

let nextTaskId = 22;
let nextUserId = 7;
let nextProjectId = 3;

async function tryFetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (e) {
    // Network or CORS error
  }
  return null;
}

export async function fetchTasks(projectId = null, priority = 'all') {
  let url = `${API_BASE}/tasks?`;
  if (projectId) url += `projectId=${projectId}&`;
  if (priority && priority !== 'all') url += `priority=${priority}&`;

  const data = await tryFetchJson(url);
  if (data) return data;

  // Local Fallback
  let result = [...localTasks];
  if (projectId) {
    result = result.filter(t => t.project_id === parseInt(projectId, 10));
  }
  if (priority && priority !== 'all') {
    result = result.filter(t => t.priority === priority.toLowerCase());
  }
  return result;
}

export async function fetchTaskById(id) {
  const data = await tryFetchJson(`${API_BASE}/tasks/${id}`);
  if (data) return data;

  const found = localTasks.find(t => t.id === parseInt(id, 10));
  if (!found) throw new Error('Task not found');
  return found;
}

export async function createTask(taskData) {
  const data = await tryFetchJson(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (data) return data;

  // Local fallback
  const user = localUsers.find(u => u.id === taskData.assigned_to);
  const newTask = {
    id: nextTaskId++,
    project_id: taskData.project_id || 1,
    assigned_to: taskData.assigned_to || null,
    title: taskData.title,
    description: taskData.description || '',
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    due_date: taskData.due_date || null,
    assigned_user_name: user ? user.name : null,
    assigned_user_avatar: user ? user.avatar_url : null
  };
  localTasks.unshift(newTask);
  return newTask;
}

export async function updateTask(id, taskData) {
  const data = await tryFetchJson(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (data) return data;

  // Local fallback
  const idx = localTasks.findIndex(t => t.id === parseInt(id, 10));
  if (idx !== -1) {
    const user = taskData.assigned_to !== undefined 
      ? localUsers.find(u => u.id === taskData.assigned_to)
      : localUsers.find(u => u.id === localTasks[idx].assigned_to);

    localTasks[idx] = {
      ...localTasks[idx],
      ...taskData,
      assigned_user_name: user ? user.name : localTasks[idx].assigned_user_name,
      assigned_user_avatar: user ? user.avatar_url : localTasks[idx].assigned_user_avatar
    };
    return localTasks[idx];
  }
  throw new Error('Task not found');
}

export async function deleteTask(id) {
  const data = await tryFetchJson(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE'
  });
  if (data) return data;

  localTasks = localTasks.filter(t => t.id !== parseInt(id, 10));
  return { message: 'Deleted', id: parseInt(id, 10) };
}

export async function fetchProjects() {
  const data = await tryFetchJson(`${API_BASE}/projects`);
  if (data) return data;

  return localProjects;
}

export async function createProject(projectData) {
  const data = await tryFetchJson(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  if (data) return data;

  const newProj = {
    id: nextProjectId++,
    name: projectData.name,
    description: projectData.description || '',
    task_count: 0
  };
  localProjects.push(newProj);
  return newProj;
}

export async function fetchUsers() {
  const data = await tryFetchJson(`${API_BASE}/users`);
  if (data) return data;

  return localUsers;
}

export async function createUser(userData) {
  const data = await tryFetchJson(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (data) return data;

  const newUser = {
    id: nextUserId++,
    name: userData.name,
    email: userData.email,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`
  };
  localUsers.push(newUser);
  return newUser;
}

export async function fetchWorkload(projectId = null) {
  let url = `${API_BASE}/users/workload`;
  if (projectId) url += `?projectId=${projectId}`;

  const data = await tryFetchJson(url);
  if (data) return data;

  // Local workload calculation
  const pId = projectId ? parseInt(projectId, 10) : null;
  const workloads = localUsers.map(user => {
    let tasks = localTasks.filter(t => t.assigned_to === user.id && t.status === 'in_progress');
    if (pId) tasks = tasks.filter(t => t.project_id === pId);
    const count = tasks.length;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      inProgressTasks: count,
      overloaded: count > 5
    };
  });
  workloads.sort((a, b) => b.inProgressTasks - a.inProgressTasks);
  return workloads;
}

export async function fetchProjectUsers(projectId) {
  const data = await tryFetchJson(`${API_BASE}/projects/${projectId}/users`);
  if (data) return data;

  return localUsers.map(u => ({ ...u, role: 'member' }));
}

export async function addUserToProject(projectId, userId, role = 'member') {
  const data = await tryFetchJson(`${API_BASE}/projects/${projectId}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, role })
  });
  if (data) return data;

  return { message: 'Added', project_id: projectId, user_id: userId, role };
}
