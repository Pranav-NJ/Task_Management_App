import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';

export default function CreateProjectModal({ isOpen, onClose, onCreateProject }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    onCreateProject({ name: name.trim(), description: description.trim() });
    setName('');
    setDescription('');
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Create New Project</h3>
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
              <label className="form-label">Project Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AI Workflow Optimization"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Key goals and scope of this project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <FolderPlus size={16} />
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
