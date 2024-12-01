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
    status: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE';
    created_at: string;
    updated_at: string;
    result?: any;
    error?: string;
  }
  
  export interface Trial {
    id: string;
    project_id: string;
    config?: TrialConfig;
    name: string;
    status: "not_started" | "in_progress" | "completed" | "failed" | "terminated";
    created_at: string;
    report_task_id?: string;
    chat_task_id?: string;
  }

  export interface TrialConfig {
    project_id: string;
    trial_id?: string;
    corpus_name?: string;
    qa_name?: string;
    config?: unknown;
    metadata?: Record<string, any>;
  }
  
  export interface CreateTrialRequest {
    name: string;
    config?: TrialConfig;
  }

  export interface SetEnvRequest {
    key: string;
    value: string;
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
    status: "PENDING" | "STARTED" | "SUCCESS" | "FAILURE";
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

  // Add interface for environment variable type
  export interface EnvVariable {
    key: string;
    value?: string;
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
        mode: 'cors',  // Explicitly set CORS mode
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer good`,
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
    
    async validateTrial(projectId: string, trialId: string) {
      const response = await fetch(`${this.baseUrl}/projects/${projectId}/trials/${trialId}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    async evaluateTrial(projectId: string, trialId: string, options: EvaluateTrialOptions = {}) {
      const response = await fetch(`${this.baseUrl}/projects/${projectId}/trials/${trialId}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_ingest: true,
          skip_validation: true,
          ...options
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }
  
    async setTrialConfig(projectId: string, trialId: string, trialConfig: TrialConfig) {
      return this.fetch<Trial>(`/projects/${projectId}/trials/${trialId}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trialConfig),
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

    async createParseTask(projectId: string, data: {
      name: string;
      extension: string;
      config: Record<string, any>;
    }) {
      const response = await fetch(
        `${this.baseUrl}/projects/${projectId}/parse`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 400) {
        return {error: "The parse name is duplicated.", status: 400};
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    async getParsedDocuments(projectId: string) {
      return this.fetch<Array<{
        parse_filepath: string;
        parse_name: string;
        module_name: string;
        module_params: string;
      }>>(`/projects/${projectId}/parse`, {
        method: 'GET'
      });
    }

    async getChunkedDocuments(projectId: string) {
      return this.fetch<Array<{
        chunk_filepath: string;
        chunk_name: string;
        module_name: string;
        module_params: string;
      }>>(`/projects/${projectId}/chunk`, {
        method: 'GET'
      });
    }

    async createChunkTask(projectId: string, data: {
      name: string;
      parsed_name: string;
      config: {
        modules: Array<Record<string, any>>;
      };
    }) {
      const response = await fetch(
        `${this.baseUrl}/projects/${projectId}/chunk`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 400) {
        return {error: "The parse name is duplicated.", status: 400};
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    async createQATask(projectId: string, data: {
      preset: string;
      name: string;
      chunked_name: string;
      qa_num: number;
      llm_config: {
        llm_name: string;
        llm_params: Record<string, any>;
      };
      lang: string;
    }) {
      const response = await fetch(
        `${this.baseUrl}/projects/${projectId}/qa`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 400) {
        return {error: "The QA name is duplicated.", status: 400};
      } else if (response.status === 401) {
        return {error: "The chunked name is not found.", status: 401};
      }else if (!response.ok) {
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

    async openReport(projectId: string, trialId: string) {
      return this.fetch<{ task_id: string, status: string }>(`/projects/${projectId}/trials/${trialId}/report/open`, {
        method: 'GET',
      });
    }

    async closeReport(projectId: string, trialId: string) {
      return this.fetch<{ task_id: string, status: string }>(`/projects/${projectId}/trials/${trialId}/report/close`, {
        method: 'GET',
      });
    }

    async openChat(projectId: string, trialId: string) {
      return this.fetch<{ task_id: string, status: string }>(`/projects/${projectId}/trials/${trialId}/chat/open`, {
        method: 'GET',
      });
    }

    async closeChat(projectId: string, trialId: string) {
      return this.fetch<{ task_id: string, status: string }>(`/projects/${projectId}/trials/${trialId}/chat/close`, {
        method: 'GET',
      });
    }

    async setEnv(request: SetEnvRequest) {
      return this.fetch<Trial>(`/env`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
    }

    async getEnvList() {
      return this.fetch<Record<string, string>>(`/env`, {
        method: 'GET',
      });
    }

    async getEnv(key: string) {
      return this.fetch<string>(`/env/${key}`, {
        method: 'GET',
      });
    }

    async deleteEnv(key: string) {
      return this.fetch<string>(`/env/${key}`, {
        method: 'DELETE',
      });
    }
  }
