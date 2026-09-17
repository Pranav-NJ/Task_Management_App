import React from 'react';
import { Users, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TeamList({ workloads = [], onAddUserClick }) {
  return (
    <div className="team-section">
      <div className="team-header">
        <div className="team-title">
          <Users size={18} className="text-primary" />
          <span>Team Workload & Capacity</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
            (Warns if &gt; 5 tasks in progress)
          </span>
        </div>
        <button className="btn-secondary" onClick={onAddUserClick} style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
          + Add Member
        </button>
      </div>

      <div className="team-grid">
        {workloads.map((user) => (
          <div
            key={user.id}
            className={`team-card ${user.overloaded ? 'is-overloaded' : ''}`}
            title={user.overloaded ? `⚠️ Overloaded! ${user.inProgressTasks} tasks in progress` : `${user.inProgressTasks} active tasks`}
          >
            <div className="avatar-wrapper">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className={`user-avatar ${user.overloaded ? 'avatar-overloaded' : ''}`}
              />
            </div>
            
            <div className="user-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="user-name">{user.name}</span>
                {user.overloaded && (
                  <span className="overloaded-badge" title="High Workload Warning">
                    BURNOUT RISK
                  </span>
                )}
              </div>
              <span className="user-workload" style={{ color: user.overloaded ? '#f87171' : 'var(--text-muted)' }}>
                {user.inProgressTasks} In Progress
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
