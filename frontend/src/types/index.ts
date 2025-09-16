export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  order: number;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskStats {
  total: number;
  overdue: number;
  byStatus: {
    todo: number;
    'in-progress': number;
    completed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  completionRate: number;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  estimatedHours?: number;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  actualHours?: number;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Socket event types
export interface SocketEvents {
  'task:created': Task;
  'task:updated': Task;
  'task:deleted': string;
  'task:order-updated': { taskOrders: { id: string; order: number }[] };
  'task:status-changed': { taskId: string; status: TaskStatus };
  'user:typing': { taskId: string; username: string };
  'user:stopped-typing': { taskId: string; username: string };
  'user:active': { userId: string; username: string; timestamp: string };
  'user:offline': { userId: string; username: string; timestamp: string };
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: Theme;
  sidebarOpen: boolean;
}

export interface NotificationState {
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: string;
}