const express = require('express');
const router = express.Router();
const workloadController = require('../controllers/workloadController');

// Workload Routes: GET /api/users/workload
router.get('/', workloadController.getUserWorkload);

module.exports = router;
