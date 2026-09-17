import React from 'react';
import { Kanban, Users, CheckSquare, Layers, AlertCircle } from 'lucide-react';

export default function Sidebar({ totalTasksCount, inProgressCount, overloadedCount }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Kanban size={22} />
        </div>
        <div className="brand-title">TaskFlow Pro</div>
      </div>

      <div className="nav-section">
        <span className="nav-label">Workspace</span>
        <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary)', color: '#fff' }}>
          <Kanban size={16} className="text-primary" />
          <span>Kanban Board</span>
        </button>
      </div>

      <div style={{ marginTop: 'auto', backgroundColor: 'var(--bg-dark)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Live Workload Metrics
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Tasks:</span>
            <span style={{ fontWeight: '700' }}>{totalTasksCount}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>In Progress:</span>
            <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{inProgressCount}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Overloaded Users:
            </span>
            <span style={{ fontWeight: '700', color: overloadedCount > 0 ? '#ef4444' : 'var(--success)' }}>
              {overloadedCount} {overloadedCount > 0 ? '⚠️' : '✓'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
