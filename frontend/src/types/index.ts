export interface User {
  id: number;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail extends Project {
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  projectId: number;
  createdAt: string;
  updatedAt: string;
  assignedToId?: number;
  assignedToEmail?: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  completed: boolean;
}

export interface ProgressResponse {
  projectId: number;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}
