
import React from 'react';
import { Habit, RepeatFrequency } from '../types';
import { PRIORITY_STYLES } from '../constants';
import { EditIcon, TrashIcon } from './icons';

interface HabitItemProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minute} ${ampm}`;
};

const formatRepeat = (habit: Habit) => {
    switch(habit.repeat) {
        case RepeatFrequency.NEVER: return 'Once';
        case RepeatFrequency.DAILY: return 'Daily';
        case RepeatFrequency.WEEKLY: return 'Weekly';
        case RepeatFrequency.MONTHLY: return 'Monthly';
        case RepeatFrequency.YEARLY: return 'Yearly';
        case RepeatFrequency.CUSTOM:
            if (!habit.repeatDays) return 'Custom';
            const days = Object.entries(habit.repeatDays)
                .filter(([, active]) => active)
                .map(([day]) => day.substring(0, 3));
            return days.length > 0 ? days.join(', ') : 'Custom';
        default: return '';
    }
};

const HabitItem: React.FC<HabitItemProps> = ({ habit, onEdit, onDelete, onToggleComplete }) => {
  const { bg, border, text } = PRIORITY_STYLES[habit.priority];
  const isCompleted = habit.completed;

  return (
    <div
      className={`
        flex items-center p-4 rounded-lg shadow-sm border-l-4 transition-all duration-300
        ${isCompleted ? 'bg-slate-100 dark:bg-slate-800 opacity-60' : `bg-white dark:bg-slate-800/50 ${bg}`}
        ${border}
      `}
    >
      <div className="flex-shrink-0 mr-4">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggleComplete(habit.id)}
          className="h-6 w-6 rounded-full border-slate-300 dark:border-slate-600 text-sky-600 focus:ring-sky-500 dark:bg-slate-700 cursor-pointer"
        />
      </div>
      <div className="flex-grow">
        <p className={`font-semibold text-lg ${isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
          {habit.name}
        </p>
        <div className="flex items-center gap-4 text-sm mt-1">
            <span className={isCompleted ? 'text-slate-400 dark:text-slate-500' : `${text} font-medium`}>{formatTime(habit.time)}</span>
            <span className="text-slate-500 dark:text-slate-400">&#8226;</span>
            <span className="text-slate-500 dark:text-slate-400">{formatRepeat(habit)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onEdit(habit)}
          className="p-2 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Edit habit"
        >
          <EditIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(habit.id)}
          className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Delete habit"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HabitItem;
