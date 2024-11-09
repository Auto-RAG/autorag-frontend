// lib/api-client.ts
export interface PreparationStatus {
    parse: "not_started" | "in_progress" | "completed" | "failed";
    chunk: "not_started" | "in_progress" | "completed" | "failed";
    qa: "not_started" | "in_progress" | "completed" | "failed";
  }
  
  export interface PerformancePoint {
    date: string;
    score: number;
  }
  
  export interface ProjectList {
    total: number;
    projects: Project[];
  }

  export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'archived';
    created_at: string;
    updated_at: string;
    trials_count: number;
    active_trials: number;
    total_qa_pairs: number;
    preparation_status: PreparationStatus;
    last_activity: string;
    performance_history: PerformancePoint[];
    current_performance: number;
  }
  
  export interface ProjectStats {
    total: number;
    active: number;
    archived: number;
    totalTrials: number;
    totalQAPairs: number;
  }
  
  export interface Task {
    id: string;
    type: 'parse' | 'chunk' | 'qa';
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
    result?: any;
    error?: string;
  }
  
  export class APIClient {
    private baseUrl: string;
    private token: string;
  
    constructor(baseUrl: string, token: string) {
      this.baseUrl = baseUrl;
      this.token = token;
    }
  
    private async fetch<T>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<T> {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        // credentials: 'include',  // 추가
        headers: {
        //   'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
  
      return response.json();
    }
  
    async getProjects(page = 1, limit = 10, status?: 'active' | 'archived') {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (status) params.append('status', status);
      return this.fetch<{ total: number; data: Project[] }>(`/projects?${params}`);
    }
  
    async getProjectStats(): Promise<ProjectStats> {
      return this.fetch<ProjectStats>('/projects/stats');
    }
  
    async createProject(data: { 
      name: string; 
      description?: string;
      config?: object;
    }) {
      return this.fetch<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  
    async updateProjectStatus(projectId: string, status: 'active' | 'archived') {
      return this.fetch<Project>(`/projects/${projectId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    }
  
    // Trial related methods
    async getTrialStats(projectId: string) {
      return this.fetch<{
        total: number;
        active: number;
        completed: number;
        failed: number;
      }>(`/projects/${projectId}/trials/stats`);
    }
  
    async startPreparation(projectId: string, trialId: string, type: 'parse' | 'chunk' | 'qa') {
      return this.fetch<Task>(`/projects/${projectId}/trials/${trialId}/${type}`, {
        method: 'POST',
      });
    }
  }