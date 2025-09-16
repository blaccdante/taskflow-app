import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';
import { getSocket, disconnectSocket } from '../services/socket';
import { Task } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useSocket = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      socketRef.current = null;
      return;
    }

    try {
      const socket = getSocket();
      socketRef.current = socket;

      // Connection events
      socket.on('connect', () => {
        console.log('🔌 Connected to server');
      });

      socket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from server:', reason);
      });

      socket.on('connect_error', (error) => {
        console.error('🚫 Connection error:', error.message);
      });

      // Task events
      socket.on('task:created', (task: Task) => {
        console.log('📝 Task created:', task.title);
        // Invalidate tasks query to refetch data
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      });

      socket.on('task:updated', (task: Task) => {
        console.log('✏️ Task updated:', task.title);
        // Update specific task in cache
        queryClient.setQueryData(['task', task.id], { task });
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      });

      socket.on('task:deleted', (taskId: string) => {
        console.log('🗑️ Task deleted:', taskId);
        // Remove from cache and invalidate queries
        queryClient.removeQueries({ queryKey: ['task', taskId] });
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      });

      socket.on('task:status-changed', (data: { taskId: string; status: Task['status'] }) => {
        console.log('🔄 Task status changed:', data);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      });

      socket.on('task:order-updated', (data: { taskOrders: { id: string; order: number }[] }) => {
        console.log('🔀 Task order updated');
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });

      // User presence events
      socket.on('user:active', (data: { userId: string; username: string; timestamp: string }) => {
        console.log('👤 User active:', data.username);
      });

      socket.on('user:offline', (data: { userId: string; username: string; timestamp: string }) => {
        console.log('👤 User offline:', data.username);
      });

      // Typing indicators (for collaborative editing)
      socket.on('user:typing', (data: { taskId: string; username: string }) => {
        console.log('✍️ User typing:', data.username);
      });

      socket.on('user:stopped-typing', (data: { taskId: string; username: string }) => {
        console.log('✍️ User stopped typing:', data.username);
      });

      // Cleanup function
      return () => {
        console.log('🧹 Cleaning up socket listeners');
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('task:created');
        socket.off('task:updated');
        socket.off('task:deleted');
        socket.off('task:status-changed');
        socket.off('task:order-updated');
        socket.off('user:active');
        socket.off('user:offline');
        socket.off('user:typing');
        socket.off('user:stopped-typing');
      };
    } catch (error) {
      console.error('Socket setup error:', error);
    }
  }, [isAuthenticated, queryClient]);

  // Cleanup on unmount or auth change
  useEffect(() => {
    return () => {
      if (!isAuthenticated) {
        disconnectSocket();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated]);

  const emitTaskCreated = (task: Task) => {
    socketRef.current?.emit('task:created', task);
  };

  const emitTaskUpdated = (task: Task) => {
    socketRef.current?.emit('task:updated', task);
  };

  const emitTaskDeleted = (taskId: string) => {
    socketRef.current?.emit('task:deleted', taskId);
  };

  const emitTaskStatusChanged = (taskId: string, status: Task['status']) => {
    socketRef.current?.emit('task:status-changed', { taskId, status });
  };

  const emitUserTyping = (taskId: string) => {
    socketRef.current?.emit('user:typing', { taskId });
  };

  const emitUserStoppedTyping = (taskId: string) => {
    socketRef.current?.emit('user:stopped-typing', { taskId });
  };

  const emitUserActive = () => {
    socketRef.current?.emit('user:active');
  };

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
    emitTaskCreated,
    emitTaskUpdated,
    emitTaskDeleted,
    emitTaskStatusChanged,
    emitUserTyping,
    emitUserStoppedTyping,
    emitUserActive,
  };
};