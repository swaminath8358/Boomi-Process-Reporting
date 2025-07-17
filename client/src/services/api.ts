import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ProcessResponse,
  ProcessExecution,
  DashboardSummary,
  FilterOptions,
  AuthResponse,
  LoginCredentials,
  LogEntry,
  FilterState,
} from '../types';

/**
 * API service for communicating with the Boomi Dashboard backend
 * Handles authentication, process data, and dashboard statistics
 */
class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('boomi-dashboard-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('boomi-dashboard-token');
          localStorage.removeItem('boomi-dashboard-user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Authentication methods
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/api/auth/login', credentials);
    return response.data;
  }

  async register(userData: {
    username: string;
    password: string;
    email: string;
    role?: string;
  }): Promise<{ message: string; user: any }> {
    const response = await this.api.post('/api/auth/register', userData);
    return response.data;
  }

  /**
   * Process data methods
   */
  async getProcesses(filters: Partial<FilterState> = {}): Promise<ProcessResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response: AxiosResponse<ProcessResponse> = await this.api.get(
      `/api/processes?${params.toString()}`
    );
    return response.data;
  }

  async getProcess(id: string | number): Promise<ProcessExecution> {
    const response: AxiosResponse<ProcessExecution> = await this.api.get(`/api/processes/${id}`);
    return response.data;
  }

  async getProcessLogs(id: string | number): Promise<{ logs: LogEntry[] }> {
    const response: AxiosResponse<{ logs: LogEntry[] }> = await this.api.get(`/api/processes/${id}/logs`);
    return response.data;
  }

  async retryProcess(id: string | number): Promise<{ message: string; newProcess: ProcessExecution }> {
    const response = await this.api.post(`/api/processes/${id}/retry`);
    return response.data;
  }

  /**
   * Dashboard statistics methods
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response: AxiosResponse<DashboardSummary> = await this.api.get('/api/processes/dashboard');
    return response.data;
  }

  /**
   * Filter metadata methods
   */
  async getFilterOptions(): Promise<FilterOptions> {
    const response: AxiosResponse<FilterOptions> = await this.api.get('/api/processes/metadata/filters');
    return response.data;
  }

  /**
   * Health check method
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    const response = await this.api.get('/health');
    return response.data;
  }

  /**
   * Utility methods
   */
  setAuthToken(token: string): void {
    localStorage.setItem('boomi-dashboard-token', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('boomi-dashboard-token');
    localStorage.removeItem('boomi-dashboard-user');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('boomi-dashboard-token');
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      // Basic token expiration check (decode JWT payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  /**
   * Download methods for exports (future enhancement)
   */
  async downloadProcessReport(filters: Partial<FilterState> = {}): Promise<Blob> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await this.api.get(`/api/processes/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Error handling utility
   */
  handleApiError(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;