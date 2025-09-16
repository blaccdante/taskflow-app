import { apiClient } from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  async getProfile(): Promise<{ user: User }> {
    return apiClient.get<{ user: User }>('/auth/profile');
  },

  async updateProfile(userData: Partial<Pick<User, 'firstName' | 'lastName' | 'avatar'>>): Promise<{ user: User; message: string }> {
    const response = await apiClient.put<{ user: User; message: string }>('/auth/profile', userData);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>('/auth/change-password', data);
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  },
};