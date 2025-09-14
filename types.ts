
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum RepeatFrequency {
  NEVER = 'never',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

export type WeekDays = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export interface Habit {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  priority: Priority;
  repeat: RepeatFrequency;
  repeatDays?: WeekDays;
  completed: boolean;
}
