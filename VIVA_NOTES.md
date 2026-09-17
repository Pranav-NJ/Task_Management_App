# Viva Preparation & Technical Architecture Notes

## 1. Overall System Architecture
- **Full-Stack REST Architecture**:
  - **Frontend**: Single Page Application built with React 18, Vite, Lucide React, and `@hello-pangea/dnd` for smooth drag-and-drop Kanban interactions.
  - **Backend**: Node.js & Express RESTful API with structured routes, controllers, and database configuration layer.
  - **Database**: PostgreSQL storing relational entity hierarchies (`projects` -> `tasks`, `users` -> `project_users`).

## 2. Why PostgreSQL?
- **Relational Integrity**: PostgreSQL handles foreign key constraints (`ON DELETE CASCADE`, `ON DELETE SET NULL`), enforcing relational hierarchy between projects, tasks, users, and permissions.
- **Transactional & Aggregation Efficiency**: Enables server-side SQL aggregation (`COUNT(...) WHERE status = 'in_progress'`) for real-time workload calculations.

## 3. Database Schema & Relationships
- **`users`**: User profiles (`id`, `name`, `email`, `avatar_url`, `created_at`).
- **`projects`**: Projects container (`id`, `name`, `description`, `created_at`).
- **`project_users`**: Junction table mapping project membership and roles (`project_id`, `user_id`, `role`).
- **`tasks`**: Tasks linked to a project and assigned user (`id`, `project_id`, `assigned_to`, `title`, `description`, `status`, `priority`, `due_date`).

## 4. Why Business Logic is strictly Server-Side
- **Single Source of Truth**: The client only displays workload calculations determined by the server API (`/api/users/workload`).
- **Data Integrity & Security**: Server-side calculation prevents client tampering, race conditions, or inconsistent state when multiple users collaborate on the board.

## 5. Workload Balancing & Burnout Warning Logic
- **SQL Aggregation Query**:
  ```sql
  SELECT 
    u.id, u.name, u.email, u.avatar_url,
    COALESCE(COUNT(t.id), 0)::INTEGER AS "inProgressTasks"
  FROM users u
  LEFT JOIN tasks t ON u.id = t.assigned_to AND t.status = 'in_progress'
  GROUP BY u.id, u.name, u.email, u.avatar_url;
  ```
- **Overloaded Condition**: Evaluated on server as `inProgressTasks > 5`.
- **Frontend Visualization**: When `overloaded === true`, CSS keyframe animation (`pulseRedWarning`) pulses the avatar background red with a "BURNOUT RISK" warning badge.

## 6. Drag-and-Drop Implementation Mechanism
1. `@hello-pangea/dnd` captures `onDragEnd` event when a task card is moved to a column (`todo`, `in_progress`, `done`).
2. Optimistic UI update immediately reflects the visual change on the Kanban board.
3. API call `PUT /api/tasks/:id` updates PostgreSQL with the destination status.
4. Workload API (`/api/users/workload`) is automatically re-fetched to update team overload metrics.

## 7. Priority Filtering Implementation
- Handled server-side via `GET /api/tasks?projectId=1&priority=high`.
- Express controller injects parameterized SQL condition `AND t.priority = $2`.

## 8. Robust Error Handling & Resilience
- Input validation on task creation & updates (required title, valid priority/status ENUM check).
- Parameterized SQL queries prevent SQL injection vulnerabilities.
- Automatic zero-downtime database fallback mechanism ensures uninterrupted application evaluation across environments.

## 9. Key Technical Decisions
- **@hello-pangea/dnd**: Fork of react-beautiful-dnd, fully updated for React 18 with smooth accessibility and touch support.
- **Express Modular Routes**: Clean separation between controllers, database pool, and routing logic for clean code presentation.
