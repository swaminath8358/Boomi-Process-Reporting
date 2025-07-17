// Process execution status types
export type ProcessStatus = 'Success' | 'Failed' | 'In Progress' | 'Warning';

// Environment types
export type Environment = 'Dev' | 'Test' | 'Prod';

// User role types
export type UserRole = 'admin' | 'viewer';

// Process execution interface
export interface ProcessExecution {
  id: string | number;
  processId: string;
  processName: string;
  startTime: string;
  endTime: string | null;
  status: ProcessStatus;
  environment: Environment;
  tradingPartner: string;
  executionTime: number | null;
  recordsProcessed: number;
  errorDetails: ErrorDetails | null;
  warnings: Warning[] | null;
  createdAt: string;
  updatedAt: string;
}

// Error details interface
export interface ErrorDetails {
  errorCode: string;
  errorType: string;
  message: string;
  stackTrace?: string;
  timestamp: string;
  retryable: boolean;
  retryCount: number;
}

// Warning interface
export interface Warning {
  warningCode: string;
  message: string;
  timestamp: string;
}

// Log entry interface
export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'DEBUG' | 'WARN' | 'ERROR';
  message: string;
  component: string;
  details?: any;
}

// Pagination interface
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// API response interface for processes
export interface ProcessResponse {
  data: ProcessExecution[];
  pagination: Pagination;
  filters: {
    environment?: Environment;
    status?: ProcessStatus;
    tradingPartner?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  };
}

// Dashboard statistics interface
export interface DashboardStats {
  total: number;
  success: number;
  failed: number;
  inProgress: number;
  warning: number;
}

// Daily trend interface
export interface DailyTrend {
  date: string;
  total: number;
  success: number;
  failed: number;
  avgExecutionTime: number;
}

// Environment breakdown interface
export interface EnvironmentBreakdown {
  [key: string]: {
    total: number;
    success: number;
    failed: number;
    inProgress: number;
  };
}

// Dashboard summary interface
export interface DashboardSummary {
  totalProcesses: number;
  todayStats: DashboardStats;
  weeklyStats: DashboardStats & { avgExecutionTime: number };
  monthlyStats: DashboardStats & { avgExecutionTime: number };
  environmentBreakdown: EnvironmentBreakdown;
  dailyTrends: DailyTrend[];
}

// Filter options interface
export interface FilterOptions {
  environments: Environment[];
  statuses: ProcessStatus[];
  tradingPartners: string[];
}

// User interface
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

// Auth response interface
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Login credentials interface
export interface LoginCredentials {
  username: string;
  password: string;
}

// API error interface
export interface ApiError {
  message: string;
  details?: string;
  status?: number;
}

// Socket event types
export interface SocketEvents {
  'process-update': {
    type: 'retry' | 'status-change' | 'new-process';
    process: ProcessExecution;
  };
  'dashboard-update': {
    summary: DashboardSummary;
  };
}

// Sort options
export interface SortOptions {
  sortBy: 'startTime' | 'processName' | 'status' | 'environment';
  sortOrder: 'asc' | 'desc';
}

// Filter state interface
export interface FilterState {
  environment?: Environment;
  status?: ProcessStatus;
  tradingPartner?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page: number;
  limit: number;
  sortBy: SortOptions['sortBy'];
  sortOrder: SortOptions['sortOrder'];
}

// Theme context interface
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// Auth context interface
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Modal props interface
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Status badge props interface
export interface StatusBadgeProps {
  status: ProcessStatus;
  className?: string;
}

// Chart data interface
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}