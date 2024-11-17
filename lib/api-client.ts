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
    total_projects: number;
    active_projects: number;
    total_trials: number;
    active_trials: number;
    total_qa_pairs: number;
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
  
  export interface Trial {
    id: string;
    project_id: string;
    status: 'active' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
    preparation_status: PreparationStatus;
    qa_pairs_count: number;
    performance_score?: number;
  }
  
  export interface CreateTrialRequest {
    name: string;
    config?: Record<string, any>;
  }
  

export interface EvaluateTrialOptions {
  full_ingest?: boolean;
  skip_validation?: boolean;
}

  export interface Task {
    id: string;
    project_id: string;
    trial_id: string;
    name: string;
    type: "parse" | "chunk" | "qa";
    status: "pending" | "in_progress" | "completed" | "failed";
    error_message?: string;
    created_at: string;
    save_path?: string;
  }

  export interface TasksResponse {
    total: number;
    data: Task[];
  }

  export interface EvaluateTrialOptions {
    full_ingest?: boolean;
    skip_validation?: boolean;
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
  
    async getProject(projectId: string) {
      const response = await this.getProjects(1, 1);
      const project = response.data.find(p => p.id === projectId);
      if (!project) {
        throw new Error(`Project with ID ${projectId} not found`);
      }
      return project;
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

    async getTrialConfig(projectId: string, trialId: string) {
      return this.fetch<Trial>(`/projects/${projectId}/trials/${trialId}/config`, {
        method: 'GET',
      });
    }

    async getTrials(projectId: string) {
      return this.fetch<{ total: number; data: Trial[] }>(`/projects/${projectId}/trials`, {
        method: 'GET',
      });
    }
    async getTrial(projectId: string, trialId: string) {
      return this.fetch<Trial>(`/projects/${projectId}/trials/${trialId}`, {
        method: 'GET',
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

    async createTrial(projectId: string, request: CreateTrialRequest) {
      return this.fetch<Trial>(`/projects/${projectId}/trials`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
    }
    
    async uploadFiles(projectId: string, formData: FormData) {
      return this.fetch<{ filePaths: string[] }>(
        `/projects/${projectId}/upload`,
        {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header - browser will set it with boundary
        }
      );
    }

    async evaluateTrial(projectId: string, trialId: string, options: EvaluateTrialOptions = {}) {
      return this.fetch<Task>(`/projects/${projectId}/trials/${trialId}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
    }
  
    async saveTrialConfig(projectId: string, trialId: string, config_yaml: string) {
      return this.fetch<Trial>(`/projects/${projectId}/trials/${trialId}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config_yaml }),
      });
    }

    async getTasks(projectId: string) {
      return this.fetch<TasksResponse>(`/projects/${projectId}/tasks`, {
        method: 'GET',
      });
    }

    async getTask(projectId: string, taskId: string) {
      return this.fetch<Task>(`/projects/${projectId}/tasks/${taskId}`, {
        method: 'GET',
      });
    }

    async createParseTask(projectId: string, trialId: string, data: {
      name: string;
      path: string;
      config: {
        modules: Array<{
          module_type: string;
          parse_method: string[];
        }>;
      };
    }) {
      const response = await fetch(
        `${this.baseUrl}/projects/${projectId}/trials/${trialId}/parse`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    async createChunkTask(projectId: string, trialId: string, data: {
      name: string;
      config: {
        modules: Array<{
          module_type: string;
          chunk_method: string[];
          chunk_size?: number;
          chunk_overlap?: number;
        }>;
      };
    }) {
      const response = await fetch(
        `${this.baseUrl}/projects/${projectId}/trials/${trialId}/chunk`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    async createQATask(projectId: string, trialId: string, data: {
      preset: string;
      name: string;
      qa_num: number;
      llm_config: {
        llm_name: string;
      };
      lang: string;
    }) {
      const response = await fetch(
        `${this.baseUrl}/projects/${projectId}/trials/${trialId}/qa`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    async waitForTask(projectId: string, taskId: string) {
      const response = await fetch(
        `${this.baseUrl}/projects/${projectId}/tasks/${taskId}`,
        {
          headers: {
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }
  }