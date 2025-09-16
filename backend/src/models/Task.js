const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 200],
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('todo', 'in-progress', 'completed'),
      defaultValue: 'todo',
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    estimatedHours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    actualHours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    hooks: {
      beforeUpdate: (task) => {
        if (task.changed('status') && task.status === 'completed') {
          task.completedAt = new Date();
        } else if (task.changed('status') && task.status !== 'completed') {
          task.completedAt = null;
        }
      },
    },
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['priority'],
      },
      {
        fields: ['dueDate'],
      },
    ],
  });

  // Instance methods
  Task.prototype.isOverdue = function() {
    if (!this.dueDate) return false;
    return new Date() > this.dueDate && this.status !== 'completed';
  };

  Task.prototype.getDaysUntilDue = function() {
    if (!this.dueDate) return null;
    const today = new Date();
    const diffTime = this.dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return Task;
};