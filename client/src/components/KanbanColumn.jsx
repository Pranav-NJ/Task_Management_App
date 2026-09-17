import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Inbox } from 'lucide-react';

export default function KanbanColumn({ columnId, title, tasks, onEditTask, onDeleteTask }) {
  return (
    <div className="kanban-column">
      <div className="column-header">
        <div className="column-title-group">
          <span className={`column-dot ${columnId}`} />
          <h3 className="column-title">{title}</h3>
        </div>
        <span className="column-counter">{tasks.length}</span>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-cards-container ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
          >
            {tasks.length === 0 ? (
              <div className="empty-state">
                <Inbox className="empty-state-icon" />
                <span className="empty-state-text">No tasks in {title}</span>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
