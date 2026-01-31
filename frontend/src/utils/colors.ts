export const colors = {
  // Primary colors
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Background colors
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  
  // Text colors
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  
  // Status colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Priority colors
  priorityLow: '#22C55E',
  priorityMedium: '#F59E0B',
  priorityHigh: '#F97316',
  priorityCritical: '#EF4444',
  
  // Status colors for tasks
  statusTodo: '#64748B',
  statusInProgress: '#3B82F6',
  statusReview: '#F59E0B',
  statusDone: '#22C55E',
  
  // Border & Divider
  border: '#334155',
  divider: '#1E293B',
  
  // White & Black
  white: '#FFFFFF',
  black: '#000000',
};

export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'low':
      return colors.priorityLow;
    case 'medium':
      return colors.priorityMedium;
    case 'high':
      return colors.priorityHigh;
    case 'critical':
      return colors.priorityCritical;
    default:
      return colors.textSecondary;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'to do':
      return colors.statusTodo;
    case 'in progress':
      return colors.statusInProgress;
    case 'review':
      return colors.statusReview;
    case 'done':
      return colors.statusDone;
    default:
      return colors.textSecondary;
  }
};
