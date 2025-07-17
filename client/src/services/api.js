import axios from 'axios';

/**
 * API service for communicating with the Boomi Dashboard backend
 * Handles authentication, process data, and dashboard statistics
 */
class ApiService {
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
  async login(credentials) {
    const response = await this.api.post('/api/auth/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post('/api/auth/register', userData);
    return response.data;
  }

  /**
   * Process data methods
   */
  async getProcesses(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await this.api.get(
      `/api/processes?${params.toString()}`
    );
    return response.data;
  }

  async getProcess(id) {
    const response = await this.api.get(`/api/processes/${id}`);
    return response.data;
  }

  async getProcessLogs(id) {
    const response = await this.api.get(`/api/processes/${id}/logs`);
    return response.data;
  }

  async retryProcess(id) {
    const response = await this.api.post(`/api/processes/${id}/retry`);
    return response.data;
  }

  /**
   * Dashboard statistics methods
   */
  async getDashboardSummary() {
    const response = await this.api.get('/api/processes/dashboard');
    return response.data;
  }

  /**
   * Filter metadata methods
   */
  async getFilterOptions() {
    const response = await this.api.get('/api/processes/metadata/filters');
    return response.data;
  }

  /**
   * Health check method
   */
  async healthCheck() {
    const response = await this.api.get('/health');
    return response.data;
  }

  /**
   * Utility methods
   */
  setAuthToken(token) {
    localStorage.setItem('boomi-dashboard-token', token);
  }

  removeAuthToken() {
    localStorage.removeItem('boomi-dashboard-token');
    localStorage.removeItem('boomi-dashboard-user');
  }

  getAuthToken() {
    return localStorage.getItem('boomi-dashboard-token');
  }

  isAuthenticated() {
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
  async downloadProcessReport(filters = {}) {
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
  handleApiError(error) {
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