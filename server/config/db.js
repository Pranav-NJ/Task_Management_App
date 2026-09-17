const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// PostgreSQL Connection Pool configuration
const pgPool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'task_management',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

let dbMode = 'memory'; // 'pg' or 'memory'

// In-Memory Data Store (Used when PostgreSQL is not connected or in cloud serverless environments)
const today = new Date().toISOString().split('T')[0];

let memoryUsers = [
  { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', created_at: new Date() },
  { id: 2, name: 'Pranav N J', email: 'pranav@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav', created_at: new Date() },
  { id: 3, name: 'Anjali Sharma', email: 'anjali@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali', created_at: new Date() },
  { id: 4, name: 'Sarah Jenkins', email: 'sarah@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', created_at: new Date() },
  { id: 5, name: 'Alex Rivera', email: 'alex@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', created_at: new Date() },
  { id: 6, name: 'Dev Patel', email: 'dev@example.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev', created_at: new Date() }
];

let memoryProjects = [
  { id: 1, name: 'TaskFlow Core System', description: 'Main enterprise productivity system architecture and Kanban engine', created_at: new Date() },
  { id: 2, name: 'Mobile App Redesign', description: 'Next-gen iOS and Android app UX update with real-time sync', created_at: new Date() }
];

let memoryProjectUsers = [
  { project_id: 1, user_id: 1, role: 'admin', created_at: new Date() },
  { project_id: 1, user_id: 2, role: 'member', created_at: new Date() },
  { project_id: 1, user_id: 3, role: 'member', created_at: new Date() },
  { project_id: 1, user_id: 4, role: 'member', created_at: new Date() },
  { project_id: 1, user_id: 5, role: 'member', created_at: new Date() },
  { project_id: 2, user_id: 1, role: 'admin', created_at: new Date() },
  { project_id: 2, user_id: 6, role: 'member', created_at: new Date() }
];

let memoryTasks = [
  // Rahul's 7 In Progress Tasks (OVERLOADED: count > 5)
  { id: 1, project_id: 1, assigned_to: 1, title: 'Optimize Database Queries', description: 'Add indexes and tune slow JOIN queries in PostgreSQL', status: 'in_progress', priority: 'high', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 2, project_id: 1, assigned_to: 1, title: 'Implement WebSocket Gateway', description: 'Real-time notifications for task updates and team presence', status: 'in_progress', priority: 'high', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 3, project_id: 1, assigned_to: 1, title: 'Fix CORS Policy Header Issue', description: 'Resolve origin mismatches when accessing API from staging subdomains', status: 'in_progress', priority: 'medium', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 4, project_id: 1, assigned_to: 1, title: 'Refactor Auth Middleware', description: 'Update JWT validation layer to support token refresh rotation', status: 'in_progress', priority: 'high', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 5, project_id: 1, assigned_to: 1, title: 'Draft API Documentation', description: 'Swagger/OpenAPI spec for tasks and workload endpoints', status: 'in_progress', priority: 'low', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 6, project_id: 1, assigned_to: 1, title: 'Setup Automated CI Pipeline', description: 'Configure GitHub Actions for automated unit and integration tests', status: 'in_progress', priority: 'medium', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 7, project_id: 1, assigned_to: 1, title: 'Security Audit Scan', description: 'Remediation of dependency vulnerabilities reported by Snyk', status: 'in_progress', priority: 'high', due_date: today, created_at: new Date(), updated_at: new Date() },

  // Pranav's Tasks
  { id: 8, project_id: 1, assigned_to: 2, title: 'Build Kanban Drag & Drop UI', description: 'Interactive column cards with smooth drop target feedback', status: 'in_progress', priority: 'high', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 9, project_id: 1, assigned_to: 2, title: 'Integrate Workload Balancing Badge', description: 'Visual status indicators and pulse animation for overloaded team members', status: 'in_progress', priority: 'high', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 10, project_id: 1, assigned_to: 2, title: 'Design Team List Widget', description: 'Sidebar avatar roster with live task counts', status: 'in_progress', priority: 'medium', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 11, project_id: 1, assigned_to: 2, title: 'Create Task Modal Dialog', description: 'Rich task creation form with date picker and user dropdown', status: 'todo', priority: 'high', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 12, project_id: 1, assigned_to: 2, title: 'Filter Tasks by Priority', description: 'Dynamic server-side filtering by low, medium, high priority', status: 'todo', priority: 'medium', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 13, project_id: 1, assigned_to: 2, title: 'Setup Frontend State Manager', description: 'Optimistic UI updates for immediate drag-and-drop feedback', status: 'done', priority: 'low', due_date: today, created_at: new Date(), updated_at: new Date() },

  // Anjali's Tasks
  { id: 14, project_id: 1, assigned_to: 3, title: 'User Permission Schema', description: 'Relational mapping for project roles and granular controls', status: 'in_progress', priority: 'high', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 15, project_id: 1, assigned_to: 3, title: 'Add User to Project Feature', description: 'Modal to invite existing users to current workspace project', status: 'in_progress', priority: 'medium', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 16, project_id: 1, assigned_to: 3, title: 'Export Tasks to CSV', description: 'Allow project managers to generate summary reports', status: 'todo', priority: 'low', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 17, project_id: 1, assigned_to: 3, title: 'Design Token Palette', description: 'HSL colors for dark mode and modern glassmorphism aesthetic', status: 'done', priority: 'medium', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 18, project_id: 1, assigned_to: 3, title: 'Mobile Layout Responsiveness', description: 'Touch-friendly drag controls on tablets and mobile screens', status: 'done', priority: 'low', due_date: today, created_at: new Date(), updated_at: new Date() },

  // Sarah's Tasks
  { id: 19, project_id: 1, assigned_to: 4, title: 'Performance Benchmarking', description: 'Load testing Express API endpoints under 1,000 concurrent requests', status: 'todo', priority: 'medium', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 20, project_id: 1, assigned_to: 4, title: 'Write E2E Cypress Tests', description: 'Automate critical user flows including drag and drop', status: 'todo', priority: 'high', due_date: today, created_at: new Date(), updated_at: new Date() },
  { id: 21, project_id: 1, assigned_to: 4, title: 'Setup Sentry Error Tracking', description: 'Catch unexpected server-side runtime exceptions', status: 'done', priority: 'low', due_date: today, created_at: new Date(), updated_at: new Date() }
];

let taskIdCounter = 22;
let userIdCounter = 7;
let projectIdCounter = 3;

// Initialize Database connection
async function initDb() {
  if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost') {
    try {
      const client = await pgPool.connect();
      console.log(' Successfully connected to PostgreSQL database!');
      client.release();
      dbMode = 'pg';
      await ensureTablesAndSeedPg();
      return;
    } catch (pgErr) {
      console.warn('⚠️ Could not connect to remote PostgreSQL server:', pgErr.message);
    }
  }

  // Check local PostgreSQL
  try {
    const client = await pgPool.connect();
    console.log(' Successfully connected to local PostgreSQL database!');
    client.release();
    dbMode = 'pg';
    await ensureTablesAndSeedPg();
  } catch (err) {
    console.log('⚡ Running zero-downtime high-performance in-memory database engine...');
    dbMode = 'memory';
  }
}

// Ensure PostgreSQL tables exist and seed initial data if empty
async function ensureTablesAndSeedPg() {
  try {
    const tableCheck = await pgPool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'tasks'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('📦 Executing PostgreSQL schema.sql...');
      const schemaSql = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
      await pgPool.query(schemaSql);
      
      console.log('🌱 Executing PostgreSQL seed.sql...');
      const seedSql = fs.readFileSync(path.join(__dirname, '../db/seed.sql'), 'utf8');
      await pgPool.query(seedSql);
      console.log(' Table creation and seeding completed for PostgreSQL!');
    }
  } catch (err) {
    console.error('Error verifying/seeding PostgreSQL database:', err.message);
  }
}

// Query Execution Handler
async function query(text, params = []) {
  if (dbMode === 'pg') {
    return await pgPool.query(text, params);
  }

  const sql = text.trim();
  const lowerSql = sql.toLowerCase();

  // 1. WORKLOAD QUERY
  if (lowerSql.includes('coalesce(count(t.id), 0)') || (lowerSql.includes('users u') && lowerSql.includes('inprogresstasks'))) {
    const projId = params.length > 0 ? parseInt(params[0], 10) : null;
    const rows = memoryUsers.map(user => {
      let userTasks = memoryTasks.filter(t => t.assigned_to === user.id && t.status === 'in_progress');
      if (projId) {
        userTasks = userTasks.filter(t => t.project_id === projId);
      }
      const inProgressCount = userTasks.length;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        inProgressTasks: inProgressCount,
        overloaded: inProgressCount > 5
      };
    });
    rows.sort((a, b) => b.inProgressTasks - a.inProgressTasks || a.name.localeCompare(b.name));
    return { rows, rowCount: rows.length };
  }

  // 2. GET ALL TASKS WITH USER JOIN
  if (lowerSql.startsWith('select') && lowerSql.includes('from tasks t')) {
    let result = [...memoryTasks];

    // Check parameters
    let paramIndex = 1;
    if (lowerSql.includes('t.project_id = $')) {
      const pId = parseInt(params[paramIndex - 1], 10);
      result = result.filter(t => t.project_id === pId);
      paramIndex++;
    }
    if (lowerSql.includes('t.priority = $')) {
      const prio = params[paramIndex - 1];
      result = result.filter(t => t.priority === prio);
      paramIndex++;
    }
    if (lowerSql.includes('t.status = $')) {
      const stat = params[paramIndex - 1];
      result = result.filter(t => t.status === stat);
      paramIndex++;
    }
    if (lowerSql.includes('t.assigned_to = $')) {
      const assId = parseInt(params[paramIndex - 1], 10);
      result = result.filter(t => t.assigned_to === assId);
      paramIndex++;
    }
    if (lowerSql.includes('t.id = $1')) {
      const idParam = parseInt(params[0], 10);
      result = result.filter(t => t.id === idParam);
    }

    const formattedRows = result.map(t => {
      const user = memoryUsers.find(u => u.id === t.assigned_to);
      return {
        ...t,
        assigned_user_name: user ? user.name : null,
        assigned_user_avatar: user ? user.avatar_url : null
      };
    });

    formattedRows.sort((a, b) => b.id - a.id);
    return { rows: formattedRows, rowCount: formattedRows.length };
  }

  // 3. INSERT TASK
  if (lowerSql.startsWith('insert into tasks')) {
    const newTask = {
      id: taskIdCounter++,
      project_id: parseInt(params[0] || 1, 10),
      assigned_to: params[1] ? parseInt(params[1], 10) : null,
      title: params[2],
      description: params[3] || '',
      status: params[4] || 'todo',
      priority: params[5] || 'medium',
      due_date: params[6] || null,
      created_at: new Date(),
      updated_at: new Date()
    };
    memoryTasks.unshift(newTask);
    return { rows: [newTask], rowCount: 1 };
  }

  // 4. UPDATE TASK
  if (lowerSql.startsWith('update tasks')) {
    const id = parseInt(params[params.length - 1], 10);
    const taskIndex = memoryTasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      memoryTasks[taskIndex] = {
        ...memoryTasks[taskIndex],
        title: params[0],
        description: params[1],
        status: params[2],
        priority: params[3],
        due_date: params[4],
        assigned_to: params[5] ? parseInt(params[5], 10) : null,
        project_id: params[6] ? parseInt(params[6], 10) : memoryTasks[taskIndex].project_id,
        updated_at: new Date()
      };
      return { rows: [memoryTasks[taskIndex]], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 5. DELETE TASK
  if (lowerSql.startsWith('delete from tasks')) {
    const id = parseInt(params[0], 10);
    memoryTasks = memoryTasks.filter(t => t.id !== id);
    return { rows: [], rowCount: 1 };
  }

  // 6. GET ALL PROJECTS
  if (lowerSql.startsWith('select') && lowerSql.includes('from projects')) {
    if (lowerSql.includes('where p.id = $1') || lowerSql.includes('where id = $1')) {
      const pId = parseInt(params[0], 10);
      const found = memoryProjects.filter(p => p.id === pId);
      return { rows: found, rowCount: found.length };
    }
    const rows = memoryProjects.map(p => {
      const count = memoryTasks.filter(t => t.project_id === p.id).length;
      return { ...p, task_count: count };
    });
    return { rows, rowCount: rows.length };
  }

  // 7. INSERT PROJECT
  if (lowerSql.startsWith('insert into projects')) {
    const newProject = {
      id: projectIdCounter++,
      name: params[0],
      description: params[1] || '',
      created_at: new Date()
    };
    memoryProjects.push(newProject);
    return { rows: [newProject], rowCount: 1 };
  }

  // 8. GET ALL USERS
  if (lowerSql.startsWith('select') && lowerSql.includes('from users')) {
    if (lowerSql.includes('where u.id = $1') || lowerSql.includes('where id = $1')) {
      const uId = parseInt(params[0], 10);
      const found = memoryUsers.filter(u => u.id === uId);
      return { rows: found, rowCount: found.length };
    }
    return { rows: memoryUsers, rowCount: memoryUsers.length };
  }

  // 9. INSERT USER
  if (lowerSql.startsWith('insert into users')) {
    const newUser = {
      id: userIdCounter++,
      name: params[0],
      email: params[1],
      avatar_url: params[2] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(params[0])}`,
      created_at: new Date()
    };
    memoryUsers.push(newUser);
    return { rows: [newUser], rowCount: 1 };
  }

  // 10. PROJECT USERS
  if (lowerSql.includes('from project_users')) {
    if (lowerSql.startsWith('select')) {
      const pId = parseInt(params[0], 10);
      const members = memoryProjectUsers
        .filter(pu => pu.project_id === pId)
        .map(pu => {
          const user = memoryUsers.find(u => u.id === pu.user_id);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar_url: user.avatar_url,
            role: pu.role,
            joined_at: pu.created_at
          };
        });
      return { rows: members, rowCount: members.length };
    }
    if (lowerSql.startsWith('insert')) {
      const pId = parseInt(params[0], 10);
      const uId = parseInt(params[1], 10);
      const role = params[2] || 'member';
      const existingIdx = memoryProjectUsers.findIndex(pu => pu.project_id === pId && pu.user_id === uId);
      if (existingIdx !== -1) {
        memoryProjectUsers[existingIdx].role = role;
      } else {
        memoryProjectUsers.push({ project_id: pId, user_id: uId, role, created_at: new Date() });
      }
      return { rows: [], rowCount: 1 };
    }
  }

  return { rows: [], rowCount: 0 };
}

module.exports = {
  query,
  initDb,
  getDbMode: () => dbMode
};
