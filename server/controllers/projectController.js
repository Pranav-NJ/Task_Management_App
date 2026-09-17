const db = require('../config/db');

// GET /api/projects
exports.getAllProjects = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.*,
        COUNT(t.id) AS task_count
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      GROUP BY p.id
      ORDER BY p.id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Project with ID ${id} not found` });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
};

// POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const result = await db.query(`
      INSERT INTO projects (name, description)
      VALUES ($1, $2)
      RETURNING *
    `, [name.trim(), description || '']);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// GET /api/projects/:projectId/users
exports.getProjectUsers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar_url,
        pu.role,
        pu.created_at AS joined_at
      FROM project_users pu
      JOIN users u ON pu.user_id = u.id
      WHERE pu.project_id = $1
      ORDER BY u.name ASC
    `, [projectId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching project users:', error);
    res.status(500).json({ error: 'Failed to retrieve project members' });
  }
};

// POST /api/projects/:projectId/users
exports.addUserToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { user_id, role } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    // Check project and user exist
    const projectCheck = await db.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ error: `Project ID ${projectId} not found` });
    }

    const userCheck = await db.query('SELECT * FROM users WHERE id = $1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: `User ID ${user_id} not found` });
    }

    const userRole = role || 'member';

    // Insert or update role if already added
    await db.query(`
      INSERT INTO project_users (project_id, user_id, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (project_id, user_id) 
      DO UPDATE SET role = EXCLUDED.role
    `, [projectId, user_id, userRole]);

    res.status(201).json({
      message: 'User added to project successfully',
      project_id: parseInt(projectId),
      user_id: parseInt(user_id),
      role: userRole
    });
  } catch (error) {
    console.error('Error adding user to project:', error);
    res.status(500).json({ error: 'Failed to add user to project' });
  }
};
