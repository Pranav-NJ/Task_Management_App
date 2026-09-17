const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const isPgConfigured = true;

// PostgreSQL Connection Pool configuration
const pgPool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'task_management',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 4000,
});

let dbMode = 'pg'; // 'pg' or 'sqlite'
let sqliteDb = null;

// Initialize Database connection and auto-seed if needed
async function initDb() {
  try {
    // Attempt PG connection test query
    const client = await pgPool.connect();
    console.log(' Successfully connected to PostgreSQL database!');
    client.release();
    dbMode = 'pg';
    await ensureTablesAndSeedPg();
  } catch (pgErr) {
    console.warn('⚠️ Could not connect to PostgreSQL server:', pgErr.message);
    console.log('🔄 Fallback initializing embedded SQLite database for zero-downtime operation...');
    dbMode = 'sqlite';
    await initSqliteFallback();
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

// Fallback SQLite Initialization
function initSqliteFallback() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '../db/fallback.sqlite');
    sqliteDb = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('Failed to open SQLite fallback database:', err);
        return reject(err);
      }
      console.log(' Embedded SQLite database initialized at:', dbPath);
      await setupSqliteTablesAndSeed();
      resolve();
    });
  });
}

function runSqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function allSqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function setupSqliteTablesAndSeed() {
  await runSqlite(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await runSqlite(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await runSqlite(`
    CREATE TABLE IF NOT EXISTS project_users (
      project_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT DEFAULT 'member',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (project_id, user_id)
    );
  `);
  await runSqlite(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      assigned_to INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
      priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const usersCount = await allSqlite(`SELECT COUNT(*) as count FROM users`);
  if (usersCount[0].count === 0) {
    console.log('🌱 Seeding SQLite database...');
    // Seed users
    const users = [
      ['Rahul Kumar', 'rahul@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul'],
      ['Pranav N J', 'pranav@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pranav'],
      ['Anjali Sharma', 'anjali@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali'],
      ['Sarah Jenkins', 'sarah@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'],
      ['Alex Rivera', 'alex@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'],
      ['Dev Patel', 'dev@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev']
    ];
    for (const u of users) {
      await runSqlite(`INSERT INTO users (name, email, avatar_url) VALUES (?, ?, ?)`, u);
    }

    // Seed projects
    await runSqlite(`INSERT INTO projects (name, description) VALUES (?, ?)`, ['TaskFlow Core System', 'Main enterprise productivity system architecture and Kanban engine']);
    await runSqlite(`INSERT INTO projects (name, description) VALUES (?, ?)`, ['Mobile App Redesign', 'Next-gen iOS and Android app UX update with real-time sync']);

    // Seed project_users
    await runSqlite(`INSERT INTO project_users (project_id, user_id, role) VALUES (1, 1, 'admin')`);
    await runSqlite(`INSERT INTO project_users (project_id, user_id, role) VALUES (1, 2, 'member')`);
    await runSqlite(`INSERT INTO project_users (project_id, user_id, role) VALUES (1, 3, 'member')`);
    await runSqlite(`INSERT INTO project_users (project_id, user_id, role) VALUES (1, 4, 'member')`);
    await runSqlite(`INSERT INTO project_users (project_id, user_id, role) VALUES (1, 5, 'member')`);
    await runSqlite(`INSERT INTO project_users (project_id, user_id, role) VALUES (2, 1, 'admin')`);
    await runSqlite(`INSERT INTO project_users (project_id, user_id, role) VALUES (2, 6, 'member')`);

    // Seed tasks (Rahul has 7 tasks in_progress to trigger overloaded = true)
    const today = new Date().toISOString().split('T')[0];
    const tasks = [
      [1, 1, 'Optimize Database Queries', 'Add indexes and tune slow JOIN queries in PostgreSQL', 'in_progress', 'high', today],
      [1, 1, 'Implement WebSocket Gateway', 'Real-time notifications for task updates and team presence', 'in_progress', 'high', today],
      [1, 1, 'Fix CORS Policy Header Issue', 'Resolve origin mismatches when accessing API from staging subdomains', 'in_progress', 'medium', today],
      [1, 1, 'Refactor Auth Middleware', 'Update JWT validation layer to support token refresh rotation', 'in_progress', 'high', today],
      [1, 1, 'Draft API Documentation', 'Swagger/OpenAPI spec for tasks and workload endpoints', 'in_progress', 'low', today],
      [1, 1, 'Setup Automated CI Pipeline', 'Configure GitHub Actions for automated unit and integration tests', 'in_progress', 'medium', today],
      [1, 1, 'Security Audit Scan', 'Remediation of dependency vulnerabilities reported by Snyk', 'in_progress', 'high', today],

      [1, 2, 'Build Kanban Drag & Drop UI', 'Interactive column cards with smooth drop target feedback', 'in_progress', 'high', today],
      [1, 2, 'Integrate Workload Balancing Badge', 'Visual status indicators and pulse animation for overloaded team members', 'in_progress', 'high', today],
      [1, 2, 'Design Team List Widget', 'Sidebar avatar roster with live task counts', 'in_progress', 'medium', today],
      [1, 2, 'Create Task Modal Dialog', 'Rich task creation form with date picker and user dropdown', 'todo', 'high', today],
      [1, 2, 'Filter Tasks by Priority', 'Dynamic server-side filtering by low, medium, high priority', 'todo', 'medium', today],
      [1, 2, 'Setup Frontend State Manager', 'Optimistic UI updates for immediate drag-and-drop feedback', 'done', 'low', today],

      [1, 3, 'User Permission Schema', 'Relational mapping for project roles and granular controls', 'in_progress', 'high', today],
      [1, 3, 'Add User to Project Feature', 'Modal to invite existing users to current workspace project', 'in_progress', 'medium', today],
      [1, 3, 'Export Tasks to CSV', 'Allow project managers to generate summary reports', 'todo', 'low', today],
      [1, 3, 'Design Token Palette', 'HSL colors for dark mode and modern glassmorphism aesthetic', 'done', 'medium', today],
      [1, 3, 'Mobile Layout Responsiveness', 'Touch-friendly drag controls on tablets and mobile screens', 'done', 'low', today],

      [1, 4, 'Performance Benchmarking', 'Load testing Express API endpoints under 1,000 concurrent requests', 'todo', 'medium', today],
      [1, 4, 'Write E2E Cypress Tests', 'Automate critical user flows including drag and drop', 'todo', 'high', today],
      [1, 4, 'Setup Sentry Error Tracking', 'Catch unexpected server-side runtime exceptions', 'done', 'low', today]
    ];

    for (const t of tasks) {
      await runSqlite(
        `INSERT INTO tasks (project_id, assigned_to, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        t
      );
    }
    console.log(' SQLite seeding finished successfully!');
  }
}

// Unified Query Function supporting Postgres ($1, $2) and SQLite (?, ?)
async function query(text, params = []) {
  if (dbMode === 'pg') {
    const res = await pgPool.query(text, params);
    return res;
  } else {
    // Convert PostgreSQL parameter syntax ($1, $2) to SQLite syntax (?, ?)
    let paramIndex = 1;
    let convertedSql = text.replace(/\$(\d+)/g, () => '?');
    
    // Convert PostgreSQL specific clauses if needed
    if (convertedSql.includes('RETURNING')) {
      const returningMatch = convertedSql.match(/RETURNING\s+([^\s;]+)/i);
      const cleanSql = convertedSql.replace(/RETURNING\s+[^\s;]+/i, '').trim();
      const result = await runSqlite(cleanSql, params);
      
      if (cleanSql.trim().toUpperCase().startsWith('INSERT')) {
        const id = result.lastID;
        const insertedRows = await allSqlite(`SELECT * FROM tasks WHERE id = ?`, [id]);
        return { rows: insertedRows, rowCount: insertedRows.length };
      } else if (cleanSql.trim().toUpperCase().startsWith('UPDATE')) {
        // Find updated item ID from params if possible
        const id = params[params.length - 1]; 
        const updatedRows = await allSqlite(`SELECT * FROM tasks WHERE id = ?`, [id]);
        return { rows: updatedRows, rowCount: updatedRows.length };
      }
    }

    const rows = await allSqlite(convertedSql, params);
    return { rows, rowCount: rows.length };
  }
}

module.exports = {
  query,
  initDb,
  getDbMode: () => dbMode
};
