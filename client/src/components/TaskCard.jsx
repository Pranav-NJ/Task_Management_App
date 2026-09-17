import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Edit3, Trash2, Clock } from 'lucide-react';

export default function TaskCard({ task, index, onEdit, onDelete }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <div className="card-top">
            <span className={`priority-badge ${task.priority}`}>
              {task.priority}
            </span>
            <div className="card-actions" onClick={(e) => e.stopPropagation()}>
              <button 
                className="action-icon-btn" 
                onClick={() => onEdit(task)}
                title="Edit Task"
              >
                <Edit3 size={14} />
              </button>
              <button 
                className="action-icon-btn delete" 
                onClick={() => onDelete(task.id)}
                title="Delete Task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <h4 className="card-title">{task.title}</h4>
          
          {task.description && (
            <p className="card-description">{task.description}</p>
          )}

          <div className="card-bottom">
            <div className="card-due-date">
              {task.due_date ? (
                <>
                  <Calendar size={13} />
                  <span>{formatDate(task.due_date)}</span>
                </>
              ) : (
                <>
                  <Clock size={13} />
                  <span>No deadline</span>
                </>
              )}
            </div>

            {task.assigned_user_name ? (
              <div className="card-assignee" title={`Assigned to ${task.assigned_user_name}`}>
                <img
                  src={task.assigned_user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigned_user_name}`}
                  alt={task.assigned_user_name}
                  className="card-avatar"
                />
                <span className="card-assignee-name">{task.assigned_user_name.split(' ')[0]}</span>
              </div>
            ) : (
              <span className="card-assignee-name" style={{ fontStyle: 'italic', opacity: 0.6 }}>
                Unassigned
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
