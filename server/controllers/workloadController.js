const db = require('../config/db');

// GET /api/users/workload
// SERVER-SIDE BUSINESS LOGIC:
// Calculates number of tasks in 'in_progress' for every user.
// overloaded = inProgressTasks > 5
exports.getUserWorkload = async (req, res) => {
  try {
    const { projectId } = req.query;

    let queryText = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar_url,
        COALESCE(COUNT(t.id), 0) AS inProgressTasks
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assigned_to AND t.status = 'in_progress'
    `;
    const params = [];

    if (projectId) {
      params.push(projectId);
      queryText += ` AND t.project_id = $${params.length}`;
    }

    queryText += `
      GROUP BY u.id, u.name, u.email, u.avatar_url
      ORDER BY "inProgressTasks" DESC, u.name ASC
    `;

    const result = await db.query(queryText, params);

    // Calculate overloaded rule server-side: inProgressTasks > 5
    const workloadData = result.rows.map(user => {
      const inProgressCount = parseInt(user.inProgressTasks ?? user.inprogressasks ?? 0, 10);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        inProgressTasks: inProgressCount,
        overloaded: inProgressCount > 5
      };
    });

    res.json(workloadData);
  } catch (error) {
    console.error('Error calculating user workload:', error);
    res.status(500).json({ error: 'Failed to calculate user workload statistics' });
  }
};
