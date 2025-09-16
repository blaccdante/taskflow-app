const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskOrder,
  getTaskStats,
} = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

// Task routes
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/order/update', updateTaskOrder);

module.exports = router;