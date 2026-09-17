import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit, users, currentProjectId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority || 'medium');
      setStatus(taskToEdit.status || 'todo');
      setDueDate(taskToEdit.due_date ? taskToEdit.due_date.split('T')[0] : '');
      setAssignedTo(taskToEdit.assigned_to ? String(taskToEdit.assigned_to) : '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setDueDate('');
      setAssignedTo(users.length > 0 ? String(users[0].id) : '');
    }
    setError('');
  }, [taskToEdit, isOpen, users]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const payload = {
      project_id: currentProjectId || 1,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      due_date: dueDate || null,
      assigned_to: assignedTo ? parseInt(assignedTo, 10) : null
    };

    onSave(payload, taskToEdit ? taskToEdit.id : null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ color: '#f87171', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Implement PostgreSQL Database Indexing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Brief summary of requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="todo">To-Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select className="form-select" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} />
              <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
