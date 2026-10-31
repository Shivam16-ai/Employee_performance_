export interface HealthResponse {
  service: string;
  version: string;
  environment: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime_seconds: number;
  database: DatabaseHealthResponse;
}

export interface DatabaseHealthResponse {
  status: 'connected' | 'disconnected';
  latency_ms: number | null;
  adapter: string;
  error?: string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

