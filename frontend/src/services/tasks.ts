import { apiClient } from './api';
import { Task, TaskStats, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '../types';

export const taskService = {
  async getTasks(filters?: TaskFilters): Promise<{
    tasks: Task[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const params = new URLSearchParams();
    
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.priority && filters.priority !== 'all') {
      params.append('priority', filters.priority);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    if (filters?.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }

    return apiClient.get<{
      tasks: Task[];
      totalCount: number;
      currentPage: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    }>(`/tasks?${params.toString()}`);
  },

  async getTaskById(id: string): Promise<{ task: Task }> {
    return apiClient.get<{ task: Task }>(`/tasks/${id}`);
  },

  async createTask(taskData: CreateTaskRequest): Promise<{ task: Task; message: string }> {
    return apiClient.post<{ task: Task; message: string }>('/tasks', taskData);
  },

  async updateTask(id: string, taskData: UpdateTaskRequest): Promise<{ task: Task; message: string }> {
    return apiClient.put<{ task: Task; message: string }>(`/tasks/${id}`, taskData);
  },

  async deleteTask(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/tasks/${id}`);
  },

  async updateTaskOrder(taskOrders: { id: string; order: number }[]): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>('/tasks/order/update', { taskOrders });
  },

  async getTaskStats(): Promise<TaskStats> {
    return apiClient.get<TaskStats>('/tasks/stats');
  },
};