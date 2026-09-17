const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Project Routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.get('/:projectId/users', projectController.getProjectUsers);
router.post('/:projectId/users', projectController.addUserToProject);

module.exports = router;
