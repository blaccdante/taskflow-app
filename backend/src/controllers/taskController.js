const { Task, User } = require('../models');
const { Op } = require('sequelize');

const getTasks = async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC',
      page = 1,
      limit = 50
    } = req.query;

    const whereClause = { userId: req.user.id };
    
    // Filter by status
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    // Filter by priority
    if (priority && priority !== 'all') {
      whereClause.priority = priority;
    }
    
    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const tasks = await Task.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'firstName', 'lastName']
      }]
    });

    res.json({
      tasks: tasks.rows,
      totalCount: tasks.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(tasks.count / parseInt(limit)),
      hasNext: offset + parseInt(limit) < tasks.count,
      hasPrev: parseInt(page) > 1
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findOne({
      where: { 
        id, 
        userId: req.user.id 
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'firstName', 'lastName']
      }]
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status = 'todo',
      priority = 'medium',
      dueDate,
      tags = [],
      estimatedHours
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: 'Task title is required'
      });
    }

    // Get the highest order number for this user
    const highestOrderTask = await Task.findOne({
      where: { userId: req.user.id },
      order: [['order', 'DESC']]
    });

    const order = highestOrderTask ? highestOrderTask.order + 1 : 0;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: Array.isArray(tags) ? tags : [],
      estimatedHours,
      order,
      userId: req.user.id
    });

    const createdTask = await Task.findByPk(task.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'firstName', 'lastName']
      }]
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: createdTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      estimatedHours,
      actualHours
    } = req.body;

    const task = await Task.findOne({
      where: { 
        id, 
        userId: req.user.id 
      }
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours;
    if (actualHours !== undefined) updateData.actualHours = actualHours;

    await task.update(updateData);

    const updatedTask = await Task.findByPk(task.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'firstName', 'lastName']
      }]
    });

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { 
        id, 
        userId: req.user.id 
      }
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    await task.destroy();

    res.json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const updateTaskOrder = async (req, res) => {
  try {
    const { taskOrders } = req.body;

    if (!Array.isArray(taskOrders)) {
      return res.status(400).json({
        message: 'taskOrders must be an array'
      });
    }

    // Update each task's order
    await Promise.all(
      taskOrders.map(async ({ id, order }) => {
        await Task.update(
          { order },
          { 
            where: { 
              id, 
              userId: req.user.id 
            } 
          }
        );
      })
    );

    res.json({
      message: 'Task order updated successfully'
    });
  } catch (error) {
    console.error('Update task order error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await Task.findAll({
      where: { userId },
      attributes: [
        'status',
        [Task.sequelize.fn('COUNT', Task.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const totalTasks = await Task.count({ where: { userId } });
    const overdueTasks = await Task.count({
      where: {
        userId,
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.ne]: 'completed' }
      }
    });

    const priorityStats = await Task.findAll({
      where: { userId },
      attributes: [
        'priority',
        [Task.sequelize.fn('COUNT', Task.sequelize.col('id')), 'count']
      ],
      group: ['priority'],
      raw: true
    });

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat.status] = parseInt(stat.count);
      return acc;
    }, { todo: 0, 'in-progress': 0, completed: 0 });

    const priorityCounts = priorityStats.reduce((acc, stat) => {
      acc[stat.priority] = parseInt(stat.count);
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    res.json({
      total: totalTasks,
      overdue: overdueTasks,
      byStatus: statusCounts,
      byPriority: priorityCounts,
      completionRate: totalTasks > 0 ? Math.round((statusCounts.completed / totalTasks) * 100) : 0
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskOrder,
  getTaskStats,
};