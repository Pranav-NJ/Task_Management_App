-- Task Management Seed Data

-- Clear existing data
TRUNCATE TABLE tasks, project_users, projects, users RESTART IDENTITY CASCADE;

-- 1. Insert Users
INSERT INTO users (id, name, email, avatar_url) VALUES
(1, 'Rahul Kumar', 'rahul@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul'),
(2, 'Pranav N J', 'pranav@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav'),
(3, 'Anjali Sharma', 'anjali@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali'),
(4, 'Sarah Jenkins', 'sarah@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'),
(5, 'Alex Rivera', 'alex@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'),
(6, 'Dev Patel', 'dev@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev');

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 2. Insert Projects
INSERT INTO projects (id, name, description) VALUES
(1, 'TaskFlow Core System', 'Main enterprise productivity system architecture and Kanban engine'),
(2, 'Mobile App Redesign', 'Next-gen iOS and Android app UX update with real-time sync');

SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));

-- 3. Associate Users with Projects
INSERT INTO project_users (project_id, user_id, role) VALUES
(1, 1, 'admin'),
(1, 2, 'member'),
(1, 3, 'member'),
(1, 4, 'member'),
(1, 5, 'member'),
(2, 1, 'admin'),
(2, 6, 'member');

-- 4. Insert Tasks
-- NOTE: User 1 (Rahul) has 7 tasks in 'in_progress' to trigger the Workload Warning (>5 tasks)!
INSERT INTO tasks (project_id, assigned_to, title, description, status, priority, due_date) VALUES
-- Rahul's 7 In Progress Tasks (OVERLOADED: count > 5)
(1, 1, 'Optimize Database Queries', 'Add indexes and tune slow JOIN queries in PostgreSQL', 'in_progress', 'high', CURRENT_DATE + INTERVAL '2 days'),
(1, 1, 'Implement WebSocket Gateway', 'Real-time notifications for task updates and team presence', 'in_progress', 'high', CURRENT_DATE + INTERVAL '3 days'),
(1, 1, 'Fix CORS Policy Header Issue', 'Resolve origin mismatches when accessing API from staging subdomains', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '1 day'),
(1, 1, 'Refactor Auth Middleware', 'Update JWT validation layer to support token refresh rotation', 'in_progress', 'high', CURRENT_DATE + INTERVAL '4 days'),
(1, 1, 'Draft API Documentation', 'Swagger/OpenAPI spec for tasks and workload endpoints', 'in_progress', 'low', CURRENT_DATE + INTERVAL '5 days'),
(1, 1, 'Setup Automated CI Pipeline', 'Configure GitHub Actions for automated unit and integration tests', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '2 days'),
(1, 1, 'Security Audit Scan', 'Remediation of dependency vulnerabilities reported by Snyk', 'in_progress', 'high', CURRENT_DATE + INTERVAL '1 day'),

-- Pranav's Tasks (3 In Progress, 2 To-Do, 1 Done)
(1, 2, 'Build Kanban Drag & Drop UI', 'Interactive column cards with smooth drop target feedback', 'in_progress', 'high', CURRENT_DATE + INTERVAL '2 days'),
(1, 2, 'Integrate Workload Balancing Badge', 'Visual status indicators and pulse animation for overloaded team members', 'in_progress', 'high', CURRENT_DATE + INTERVAL '1 day'),
(1, 2, 'Design Team List Widget', 'Sidebar avatar roster with live task counts', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '3 days'),
(1, 2, 'Create Task Modal Dialog', 'Rich task creation form with date picker and user dropdown', 'todo', 'high', CURRENT_DATE + INTERVAL '4 days'),
(1, 2, 'Filter Tasks by Priority', 'Dynamic server-side filtering by low, medium, high priority', 'todo', 'medium', CURRENT_DATE + INTERVAL '5 days'),
(1, 2, 'Setup Frontend State Manager', 'Optimistic UI updates for immediate drag-and-drop feedback', 'done', 'low', CURRENT_DATE - INTERVAL '1 day'),

-- Anjali's Tasks (2 In Progress, 1 To-Do, 2 Done)
(1, 3, 'User Permission Schema', 'Relational mapping for project roles and granular controls', 'in_progress', 'high', CURRENT_DATE + INTERVAL '3 days'),
(1, 3, 'Add User to Project Feature', 'Modal to invite existing users to current workspace project', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '4 days'),
(1, 3, 'Export Tasks to CSV', 'Allow project managers to generate summary reports', 'todo', 'low', CURRENT_DATE + INTERVAL '6 days'),
(1, 3, 'Design Token Palette', 'HSL colors for dark mode and modern glassmorphism aesthetic', 'done', 'medium', CURRENT_DATE - INTERVAL '2 days'),
(1, 3, 'Mobile Layout Responsiveness', 'Touch-friendly drag controls on tablets and mobile screens', 'done', 'low', CURRENT_DATE - INTERVAL '3 days'),

-- Sarah's Tasks (0 In Progress, 2 To-Do, 1 Done)
(1, 4, 'Performance Benchmarking', 'Load testing Express API endpoints under 1,000 concurrent requests', 'todo', 'medium', CURRENT_DATE + INTERVAL '7 days'),
(1, 4, 'Write E2E Cypress Tests', 'Automate critical user flows including drag and drop', 'todo', 'high', CURRENT_DATE + INTERVAL '8 days'),
(1, 4, 'Setup Sentry Error Tracking', 'Catch unexpected server-side runtime exceptions', 'done', 'low', CURRENT_DATE - INTERVAL '4 days'),

-- Alex & Dev Tasks
(1, 5, 'Audit Accessible Color Contrast', 'Ensure WCAG AA compliance across dashboard theme', 'todo', 'low', CURRENT_DATE + INTERVAL '5 days'),
(2, 6, 'Setup React Native Repository', 'Initial boilerplate setup for mobile project', 'todo', 'high', CURRENT_DATE + INTERVAL '10 days');

SELECT setval('tasks_id_seq', (SELECT MAX(id) FROM tasks));
