import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  email: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  recurrencePattern: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  recurrenceEndDate: string | null;
  projectId: number;
  assignedToId: number | null;
  assignedToEmail: string | null;
  tags: Tag[];
  dependsOnIds: number[];
  blockedByIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  projectId: number;
}

export interface ProjectMember {
  id: number;
  userId: number;
  userEmail: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
}

export interface Invitation {
  id: number;
  projectId: number;
  projectTitle: string;
  inviteeId: number;
  inviteeEmail: string;
  inviterId: number;
  inviterEmail: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  invitedAt: string;
  respondedAt: string | null;
}

export interface UserStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  tasksThisWeek: number;
  completionRate: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

// API Functions

// Auth
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (email: string, password: string) =>
  api.post('/auth/register', { email, password });

// Projects
export const getProjects = () => api.get('/projects');

export const getProjectById = (id: number) => api.get(`/projects/${id}`);

export const createProject = (title: string, description: string) =>
  api.post('/projects', { title, description });

export const getProjectProgress = (projectId: number) =>
  api.get(`/projects/${projectId}/progress`);

// Tasks
export const getTasksByProject = (projectId: number) =>
  api.get(`/projects/${projectId}/tasks`);

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  recurrencePattern?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  recurrenceEndDate?: string;
  tagIds?: number[];
  dependsOnIds?: number[];
}

export const createTask = (projectId: number, data: CreateTaskRequest) =>
  api.post(`/projects/${projectId}/tasks`, data);

export const updateTask = (taskId: number, completed: boolean) =>
  api.patch(`/tasks/${taskId}`, { completed });

export const deleteTask = (taskId: number) => api.delete(`/tasks/${taskId}`);

export const assignTask = (taskId: number, userId: number) =>
  api.put(`/tasks/${taskId}/assign`, { userId });

export const unassignTask = (taskId: number) =>
  api.delete(`/tasks/${taskId}/assign`);

export const updateTaskStatus = (taskId: number, status: 'TODO' | 'IN_PROGRESS' | 'DONE') =>
  api.put(`/tasks/${taskId}/status`, { status });

// Stats
export const getUserStats = () => api.get('/stats');

// Members
export const getProjectMembers = (projectId: number) =>
  api.get(`/projects/${projectId}/members`);

export const removeMember = (projectId: number, userId: number) =>
  api.delete(`/projects/${projectId}/members/${userId}`);

export const updateMemberRole = (projectId: number, userId: number, role: 'ADMIN' | 'MEMBER') =>
  api.put(`/projects/${projectId}/members/${userId}/role`, { role });

// Invitations
export const inviteUser = (projectId: number, userEmail: string, role: 'ADMIN' | 'MEMBER') =>
  api.post(`/invitations/projects/${projectId}/invite`, { userEmail, role });

export const getPendingInvitations = () =>
  api.get('/invitations/pending');

export const getProjectInvitations = (projectId: number) =>
  api.get(`/invitations/projects/${projectId}`);

export const acceptInvitation = (invitationId: number) =>
  api.post(`/invitations/${invitationId}/accept`);

export const declineInvitation = (invitationId: number) =>
  api.post(`/invitations/${invitationId}/decline`);

export const cancelInvitation = (projectId: number, invitationId: number) =>
  api.delete(`/invitations/projects/${projectId}/invitations/${invitationId}`);

// Invite Codes
export const generateInviteCode = (projectId: number) =>
  api.post(`/invitations/projects/${projectId}/code`);

export const joinProjectByCode = (inviteCode: string) =>
  api.post('/invitations/join', { inviteCode });

// User Search
export const searchUsers = (email: string) =>
  api.get(`/users/search`, { params: { email } });

// Tags
export const getProjectTags = (projectId: number) =>
  api.get(`/projects/${projectId}/tags`);

export const createTag = (projectId: number, name: string, color: string) =>
  api.post(`/projects/${projectId}/tags`, { name, color });

export const deleteTag = (projectId: number, tagId: number) =>
  api.delete(`/projects/${projectId}/tags/${tagId}`);

// Bulk Operations
export const bulkCompleteTasks = (taskIds: number[]) =>
  api.post('/tasks/bulk/complete', { taskIds });

export const bulkDeleteTasks = (taskIds: number[]) =>
  api.delete('/tasks/bulk', { data: { taskIds } });

export default api;
