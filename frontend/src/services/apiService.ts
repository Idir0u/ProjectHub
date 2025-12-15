import api from './api';
import {
  LoginRequest,
  LoginResponse,
  Project,
  ProjectDetail,
  CreateProjectRequest,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  ProgressResponse,
} from '../types';

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
};

// Projects API
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  getById: async (id: number): Promise<ProjectDetail> => {
    const response = await api.get<ProjectDetail>(`/projects/${id}`);
    return response.data;
  },

  create: async (project: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<Project>('/projects', project);
    return response.data;
  },

  getProgress: async (id: number): Promise<ProgressResponse> => {
    const response = await api.get<ProgressResponse>(`/projects/${id}/progress`);
    return response.data;
  },
};

// Tasks API
export const tasksApi = {
  getByProject: async (projectId: number): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },

  create: async (projectId: number, task: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, task);
    return response.data;
  },

  update: async (taskId: number, update: UpdateTaskRequest): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}`, update);
    return response.data;
  },

  delete: async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};
