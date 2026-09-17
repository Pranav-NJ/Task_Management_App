const db = require('../config/db');

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email, avatar_url } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'User name is required' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'User email is required' });
    }

    const avatar = avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const result = await db.query(`
      INSERT INTO users (name, email, avatar_url)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [name.trim(), email.trim(), avatar]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === '23505') { // Unique constraint violation in PG
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
};
