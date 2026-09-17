const db = require('../config/db');

// Valid status & priority values
const VALID_STATUSES = ['todo', 'in_progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// GET /api/tasks
exports.getAllTasks = async (req, res) => {
  try {
    const { projectId, priority, status, assignedTo } = req.query;
    let queryText = `
      SELECT 
        t.id, 
        t.project_id, 
        t.assigned_to, 
        t.title, 
        t.description, 
        t.status, 
        t.priority, 
        t.due_date, 
        t.created_at, 
        t.updated_at,
        u.name AS assigned_user_name,
        u.avatar_url AS assigned_user_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE 1=1
    `;
    const queryParams = [];

    if (projectId) {
      queryParams.push(projectId);
      queryText += ` AND t.project_id = $${queryParams.length}`;
    }

    if (priority && priority !== 'all') {
      if (!VALID_PRIORITIES.includes(priority.toLowerCase())) {
        return res.status(400).json({ error: `Invalid priority filter. Must be one of: ${VALID_PRIORITIES.join(', ')}` });
      }
      queryParams.push(priority.toLowerCase());
      queryText += ` AND t.priority = $${queryParams.length}`;
    }

    if (status) {
      if (!VALID_STATUSES.includes(status.toLowerCase())) {
        return res.status(400).json({ error: `Invalid status filter. Must be one of: ${VALID_STATUSES.join(', ')}` });
      }
      queryParams.push(status.toLowerCase());
      queryText += ` AND t.status = $${queryParams.length}`;
    }

    if (assignedTo) {
      queryParams.push(assignedTo);
      queryText += ` AND t.assigned_to = $${queryParams.length}`;
    }

    queryText += ` ORDER BY t.id DESC`;

    const result = await db.query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to retrieve tasks from database' });
  }
};

// GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        t.*, 
        u.name AS assigned_user_name,
        u.avatar_url AS assigned_user_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    res.status(500).json({ error: 'Failed to retrieve task details' });
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { project_id, assigned_to, title, description, status, priority, due_date } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const taskStatus = (status || 'todo').toLowerCase();
    if (!VALID_STATUSES.includes(taskStatus)) {
      return res.status(400).json({ error: `Invalid status '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const taskPriority = (priority || 'medium').toLowerCase();
    if (!VALID_PRIORITIES.includes(taskPriority)) {
      return res.status(400).json({ error: `Invalid priority '${priority}'. Must be one of: ${VALID_PRIORITIES.join(', ')}` });
    }

    const projectId = project_id || 1;

    const result = await db.query(`
      INSERT INTO tasks (project_id, assigned_to, title, description, status, priority, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [projectId, assigned_to || null, title.trim(), description || '', taskStatus, taskPriority, due_date || null]);

    // Fetch newly created task with user details
    const newTaskId = result.rows[0].id;
    const taskWithUser = await db.query(`
      SELECT 
        t.*, 
        u.name AS assigned_user_name,
        u.avatar_url AS assigned_user_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = $1
    `, [newTaskId]);

    res.status(201).json(taskWithUser.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create new task' });
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date, assigned_to, project_id } = req.body;

    // Verify task existence
    const existing = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }

    const currentTask = existing.rows[0];

    const updatedTitle = title !== undefined ? title.trim() : currentTask.title;
    if (!updatedTitle) {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }

    const updatedStatus = status !== undefined ? status.toLowerCase() : currentTask.status;
    if (status !== undefined && !VALID_STATUSES.includes(updatedStatus)) {
      return res.status(400).json({ error: `Invalid status '${status}'. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const updatedPriority = priority !== undefined ? priority.toLowerCase() : currentTask.priority;
    if (priority !== undefined && !VALID_PRIORITIES.includes(updatedPriority)) {
      return res.status(400).json({ error: `Invalid priority '${priority}'. Must be one of: ${VALID_PRIORITIES.join(', ')}` });
    }

    const updatedAssignedTo = assigned_to !== undefined ? assigned_to : currentTask.assigned_to;
    const updatedDescription = description !== undefined ? description : currentTask.description;
    const updatedDueDate = due_date !== undefined ? due_date : currentTask.due_date;
    const updatedProjectId = project_id !== undefined ? project_id : currentTask.project_id;

    await db.query(`
      UPDATE tasks 
      SET 
        title = $1,
        description = $2,
        status = $3,
        priority = $4,
        due_date = $5,
        assigned_to = $6,
        project_id = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
    `, [updatedTitle, updatedDescription, updatedStatus, updatedPriority, updatedDueDate, updatedAssignedTo, updatedProjectId, id]);

    // Fetch updated task with user details
    const updatedWithUser = await db.query(`
      SELECT 
        t.*, 
        u.name AS assigned_user_name,
        u.avatar_url AS assigned_user_avatar
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = $1
    `, [id]);

    res.json(updatedWithUser.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }

    await db.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: `Task ${id} deleted successfully`, id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
