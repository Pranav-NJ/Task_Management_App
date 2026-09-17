import React from 'react';
import { FolderKanban, Plus } from 'lucide-react';

export default function ProjectSelector({ projects, currentProjectId, onSelectProject, onCreateProjectClick }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <FolderKanban size={18} className="text-primary" />
      <select
        className="form-select"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          fontWeight: 600,
          color: 'var(--text-main)',
          paddingRight: '2rem'
        }}
        value={currentProjectId || ''}
        onChange={(e) => onSelectProject(parseInt(e.target.value, 10))}
      >
        {projects.map((proj) => (
          <option key={proj.id} value={proj.id}>
            {proj.name}
          </option>
        ))}
      </select>
      <button
        className="btn-secondary"
        onClick={onCreateProjectClick}
        title="Create New Project"
        style={{ padding: '0.45rem 0.6rem' }}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
