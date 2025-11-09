import type { DateRange, TrendsData } from './types';

const API_BASE = '/api';

export interface CompareRequest {
  phrases: string[];
  dateRange: DateRange;
  region: string;
}

export interface CompareResponse {
  results: TrendsData[];
  region: string;
  dateRange: {
    start: string;
    end: string;
    preset?: string;
  };
  fetchedAt: string;
  source: 'api' | 'manual';
  cached?: boolean;
}

export const trendsApi = {
  async compare(request: CompareRequest): Promise<CompareResponse> {
    const response = await fetch(`${API_BASE}/trends/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || error.message || 'Failed to fetch trends data');
    }

    return response.json();
  },

  async getCacheStatus() {
    const response = await fetch(`${API_BASE}/trends/cache/status`);
    return response.json();
  },

  async clearCache() {
    const response = await fetch(`${API_BASE}/trends/cache/clear`, {
      method: 'POST',
    });
    return response.json();
  },

  async healthCheck() {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  },
};
