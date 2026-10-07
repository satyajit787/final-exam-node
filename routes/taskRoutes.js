const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Protect all task routes
router.use(authenticateToken);

// User tasks
router.get('/', taskController.getMyTasks);

// Admin view - all user tasks
router.get('/all', requireAdmin, taskController.getAllTasks);

// Create task
router.get('/new', taskController.getNewTaskForm);
router.post('/new', taskController.createTask);

// Edit task
router.get('/edit/:id', taskController.getEditTaskForm);
router.post('/edit/:id', taskController.updateTask);

// Delete task
router.get('/delete/:id', taskController.deleteTask);

module.exports = router;
