import React from 'react';
import ProjectSelector from './ProjectSelector';
import { Plus, Filter, Search } from 'lucide-react';

export default function Header({
  projects,
  currentProjectId,
  onSelectProject,
  priorityFilter,
  onPriorityFilterChange,
  searchQuery,
  onSearchQueryChange,
  onCreateTaskClick,
  onAddUserClick,
  onCreateProjectClick
}) {
  return (
    <header className="header">
      <div className="header-left">
        <ProjectSelector
          projects={projects}
          currentProjectId={currentProjectId}
          onSelectProject={onSelectProject}
          onCreateProjectClick={onCreateProjectClick}
        />

        {/* Priority Filter Controls */}
        <div className="filter-group">
          <Filter size={14} style={{ color: 'var(--text-muted)', marginLeft: '0.4rem' }} />
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              className={`filter-btn ${priorityFilter === p ? 'active' : ''}`}
              onClick={() => onPriorityFilterChange(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="header-right">
        {/* Search input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            style={{ paddingLeft: '2.1rem', paddingRight: '0.75rem', height: '36px', fontSize: '0.8rem', width: '180px' }}
          />
        </div>

        <button className="btn-primary" onClick={onCreateTaskClick}>
          <Plus size={16} />
          <span>Create Task</span>
        </button>
      </div>
    </header>
  );
}
