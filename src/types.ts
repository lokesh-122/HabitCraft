export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  reminderTime?: string;
  reminderDays?: string[];
  motivationalMessages?: string[];
  progress: ProgressEntry[];
  streakCount: number;
  category?: string;
  color?: string;
}

export interface ProgressEntry {
  date: string;
  completed: boolean;
}

export interface Reminder {
  id: string;
  habitId: string;
  time: string;
  message: string;
  sent: boolean;
}

export interface AIInsight {
  id: string;
  habitId: string;
  type: 'pattern' | 'suggestion' | 'motivation';
  message: string;
  date: string;
}