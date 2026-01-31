// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization_id?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  organization_id?: string;
  created_by: string;
  members: string[];
  statuses: string[];
  created_at: string;
}

// Task Types
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  due_date?: string;
  start_date?: string;
  assignee_id?: string;
  assignee_name?: string;
  project_id?: string;
  project_name?: string;
  tags: string[];
  subtasks: SubTask[];
  recurring?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  due_date?: string;
  start_date?: string;
  assignee_id?: string;
  project_id?: string;
  tags?: string[];
  subtasks?: SubTask[];
  recurring?: string;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  task_id: string;
  user_id: string;
  user_name: string;
  created_at: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  task_id?: string;
  read: boolean;
  created_at: string;
}

// Activity Types
export interface Activity {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  action: string;
  details?: string;
  created_at: string;
}

// Dashboard Types
export interface DashboardStats {
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  in_progress_tasks: number;
  tasks_by_status: Record<string, number>;
  tasks_by_priority: Record<string, number>;
}
