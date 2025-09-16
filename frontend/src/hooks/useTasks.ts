import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/tasks';
import { Task, TaskStats, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '../types';

export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  });
};

export const useTaskStats = () => {
  return useQuery({
    queryKey: ['task-stats'],
    queryFn: () => taskService.getTaskStats(),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskData: CreateTaskRequest) => taskService.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) => 
      taskService.updateTask(id, data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
    },
  });
};

export const useUpdateTaskOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskOrders: { id: string; order: number }[]) => 
      taskService.updateTaskOrder(taskOrders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};