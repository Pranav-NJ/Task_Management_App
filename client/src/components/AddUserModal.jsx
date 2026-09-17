import React, { useState } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose, onAddExistingUser, onCreateNewUser, existingUsers, currentProjectId }) {
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' | 'new'
  const [selectedUserId, setSelectedUserId] = useState('');
  const [role, setRole] = useState('member');

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddExisting = (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a user to add');
      return;
    }
    onAddExistingUser(parseInt(selectedUserId, 10), role);
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      setError('Name and email are required');
      return;
    }
    onCreateNewUser({ name: newUserName.trim(), email: newUserEmail.trim() }, role);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add Team Member to Project</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '0 1.5rem', gap: '1.5rem' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: '0.75rem 0',
              color: activeTab === 'existing' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'existing' ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
            onClick={() => { setActiveTab('existing'); setError(''); }}
          >
            Existing User
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: '0.75rem 0',
              color: activeTab === 'new' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'new' ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
            onClick={() => { setActiveTab('new'); setError(''); }}
          >
            Create New User
          </button>
        </div>

        {activeTab === 'existing' ? (
          <form onSubmit={handleAddExisting}>
            <div className="modal-body">
              {error && (
                <div style={{ color: '#f87171', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                  {error}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Select User</label>
                <select
                  className="form-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="">-- Choose User --</option>
                  {existingUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Project Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="member">Member</option>
                  <option value="admin">Project Admin</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <UserPlus size={16} />
                <span>Add to Project</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateNew}>
            <div className="modal-body">
              {error && (
                <div style={{ color: '#f87171', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                  {error}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Elena Rostova"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="elena@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="member">Member</option>
                  <option value="admin">Project Admin</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <UserPlus size={16} />
                <span>Create &amp; Add</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
