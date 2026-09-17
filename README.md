# TaskFlow Pro — Streamlined Task Management App with Workload Balancing

A full-stack enterprise task management application featuring a drag-and-drop Kanban board, user project permissions, priority filtering, and real-time server-calculated **Workload Balancing** to prevent team burnout.

---

## 🚀 Key Features

- **Interactive Kanban Board**: Three columns (`To-Do`, `In Progress`, `Done`) with drag-and-drop capability.
- **Task Management**: Create, edit, assign, and delete tasks with priority badges (`Low`, `Medium`, `High`), due dates, and descriptions.
- **Server-Side Workload Balancing**: Real-time workload computation on the backend. If any team member has **more than 5 tasks in "In Progress"**, their avatar pulses red with a **BURNOUT RISK** warning banner.
- **Project & User Associations**: Relational user permissions per project with roles (`admin`, `member`) and modal control to invite members.
- **Priority Filtering & Search**: Server-side filtering by task priority (`All`, `High`, `Medium`, `Low`) and real-time title search.
- **Live Metric Counter**: Each column displays live task counters (`To-Do (4)`, `In Progress (7)`, `Done (3)`).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, JavaScript, `@hello-pangea/dnd`, Lucide React, Modern CSS System.
- **Backend**: Node.js, Express.js, REST API architecture.
- **Database**: PostgreSQL (`pg` driver) with relational schema constraints and parameterized SQL queries.

---

## 📐 Architecture Overview

```
TaskFlow Pro
 ├── server/
 │    ├── config/          # PostgreSQL Database connection pool & auto-init
 │    ├── controllers/     # Task, Project, User, & Workload business logic
 │    ├── db/              # schema.sql and seed.sql scripts
 │    ├── routes/          # RESTful Express route definitions
 │    └── server.js        # Express server entry point
 └── client/
      ├── src/
      │    ├── components/ # KanbanBoard, TaskCard, TeamList, Modals, Header, Sidebar
      │    ├── services/   # Centralized API fetch layer
      │    ├── App.jsx     # Dashboard layout & state management
      │    └── index.css   # HSL Design tokens & pulse warning animations
      ├── index.html
      └── vite.config.js   # Vite proxy settings for API routes
```

---

## 🗄️ Database Schema

### `users`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(255))
- `email` (VARCHAR(255) UNIQUE)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMP)

### `projects`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(255))
- `description` (TEXT)
- `created_at` (TIMESTAMP)

### `project_users`
- `project_id` (FOREIGN KEY -> `projects.id`)
- `user_id` (FOREIGN KEY -> `users.id`)
- `role` (VARCHAR(50) DEFAULT 'member')
- `PRIMARY KEY (project_id, user_id)`

### `tasks`
- `id` (SERIAL PRIMARY KEY)
- `project_id` (FOREIGN KEY -> `projects.id`)
- `assigned_to` (FOREIGN KEY -> `users.id`)
- `title` (VARCHAR(255))
- `description` (TEXT)
- `status` ('todo' | 'in_progress' | 'done')
- `priority` ('low' | 'medium' | 'high')
- `due_date` (DATE)
- `created_at` / `updated_at` (TIMESTAMP)

---

## 🔌 API Endpoints

### Tasks
- `GET /api/tasks` — List tasks (Filters: `projectId`, `priority`, `status`, `assignedTo`)
- `GET /api/tasks/:id` — Retrieve task details
- `POST /api/tasks` — Create new task
- `PUT /api/tasks/:id` — Update task (status, title, priority, assignee, etc.)
- `DELETE /api/tasks/:id` — Delete task

### Projects & Permissions
- `GET /api/projects` — List projects with task counts
- `GET /api/projects/:id` — Get project details
- `POST /api/projects` — Create new project
- `GET /api/projects/:projectId/users` — Get project team members
- `POST /api/projects/:projectId/users` — Add/associate user to project

### Users & Workload
- `GET /api/users` — List users
- `POST /api/users` — Create user
- `GET /api/users/workload` — **Server-Side Workload Balancing API** (`inProgressTasks`, `overloaded: true/false`)

---

## ⚡ Workload Balancing Rule

The backend computes the workload statistics using SQL aggregation:
- `inProgressTasks`: Count of tasks assigned to a user with `status = 'in_progress'`.
- `overloaded`: Evaluated server-side as `inProgressTasks > 5`.

When `overloaded: true`, the user avatar in the Team roster pulses red using keyframe animation to warn managers of potential burnout.

---

## ⚙️ Quick Start Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Optional; database schema auto-seeds automatically)

### 1. Installation
Clone the repository and install dependencies:
```bash
# Install root & backend dependencies
npm install

# Install frontend dependencies
npm --prefix client install
```

### 2. Environment Variables
Create `.env` file in the project root:
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
```

### 3. Database Setup & Seeding
To manually seed initial data (contains seed user with 7 tasks in progress to demonstrate workload warning):
```bash
npm run seed
```

### 4. Running the Application
Run both backend Express server and frontend React client concurrently:
```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 📸 Application Screenshots

*(Insert screenshots of Kanban board, drag and drop, and pulse red workload warning here)*
