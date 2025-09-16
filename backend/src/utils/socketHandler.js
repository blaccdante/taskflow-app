const { verifyToken } = require('./jwt');
const { User } = require('../models');

const socketHandler = (io) => {
  // Middleware for socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      const decoded = verifyToken(token);
      const user = await User.findByPk(decoded.userId);
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error: Invalid user'));
      }

      socket.userId = user.id;
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.username} connected with socket ID: ${socket.id}`);
    
    // Join user to their personal room for task updates
    socket.join(`user-${socket.userId}`);

    // Handle task created
    socket.on('task:created', (taskData) => {
      // Broadcast to all clients of this user (multiple tabs/devices)
      socket.to(`user-${socket.userId}`).emit('task:created', taskData);
    });

    // Handle task updated
    socket.on('task:updated', (taskData) => {
      socket.to(`user-${socket.userId}`).emit('task:updated', taskData);
    });

    // Handle task deleted
    socket.on('task:deleted', (taskId) => {
      socket.to(`user-${socket.userId}`).emit('task:deleted', taskId);
    });

    // Handle task order updated
    socket.on('task:order-updated', (orderData) => {
      socket.to(`user-${socket.userId}`).emit('task:order-updated', orderData);
    });

    // Handle task status changed
    socket.on('task:status-changed', (data) => {
      socket.to(`user-${socket.userId}`).emit('task:status-changed', data);
    });

    // Handle user typing (for collaborative features)
    socket.on('user:typing', (data) => {
      socket.to(`user-${socket.userId}`).emit('user:typing', {
        ...data,
        userId: socket.userId,
        username: socket.username
      });
    });

    // Handle user stopped typing
    socket.on('user:stopped-typing', (data) => {
      socket.to(`user-${socket.userId}`).emit('user:stopped-typing', {
        ...data,
        userId: socket.userId,
        username: socket.username
      });
    });

    // Handle user presence
    socket.on('user:active', () => {
      socket.to(`user-${socket.userId}`).emit('user:active', {
        userId: socket.userId,
        username: socket.username,
        timestamp: new Date()
      });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.username} disconnected: ${reason}`);
      
      // Notify other clients that user went offline
      socket.to(`user-${socket.userId}`).emit('user:offline', {
        userId: socket.userId,
        username: socket.username,
        timestamp: new Date()
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.username}:`, error);
    });
  });

  // Global error handler
  io.on('error', (error) => {
    console.error('Socket.IO server error:', error);
  });
};

// Helper function to emit to specific user
const emitToUser = (io, userId, event, data) => {
  io.to(`user-${userId}`).emit(event, data);
};

module.exports = socketHandler;
module.exports.emitToUser = emitToUser;