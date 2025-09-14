
import { Priority, RepeatFrequency } from './types';

export const PRIORITY_OPTIONS = [
  { value: Priority.LOW, label: 'Low' },
  { value: Priority.MEDIUM, label: 'Medium' },
  { value: Priority.HIGH, label: 'High' },
];

export const REPEAT_OPTIONS = [
  { value: RepeatFrequency.NEVER, label: 'Never' },
  { value: RepeatFrequency.DAILY, label: 'Everyday' },
  { value: RepeatFrequency.WEEKLY, label: 'Every Week' },
  { value: RepeatFrequency.MONTHLY, label: 'Every Month' },
  { value: RepeatFrequency.YEARLY, label: 'Every Year' },
  { value: RepeatFrequency.CUSTOM, label: 'Custom Days' },
];

export const PRIORITY_STYLES: { [key in Priority]: { bg: string; border: string; text: string } } = {
  [Priority.LOW]: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', border: 'border-yellow-400 dark:border-yellow-600', text: 'text-yellow-800 dark:text-yellow-300' },
  [Priority.MEDIUM]: { bg: 'bg-orange-100 dark:bg-orange-900/50', border: 'border-orange-400 dark:border-orange-600', text: 'text-orange-800 dark:text-orange-300' },
  [Priority.HIGH]: { bg: 'bg-red-100 dark:bg-red-900/50', border: 'border-red-400 dark:border-red-600', text: 'text-red-800 dark:text-red-300' },
};

export const WEEK_DAYS_KEYS: (keyof import('./types').WeekDays)[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export const getTodayDateString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

export const getCurrentTimeString = (): string => {
    const today = new Date();
    return today.toTimeString().substring(0, 5);
};
