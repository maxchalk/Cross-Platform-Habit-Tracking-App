
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { Habit, Priority, RepeatFrequency, WeekDays } from '../types';
import { PRIORITY_OPTIONS, REPEAT_OPTIONS, WEEK_DAYS_KEYS, getTodayDateString, getCurrentTimeString } from '../constants';

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habit: Omit<Habit, 'id' | 'completed'> & { id?: string }) => void;
  habitToEdit: Habit | null;
}

const initialWeekDays: WeekDays = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
};

const HabitForm: React.FC<HabitFormProps> = ({ isOpen, onClose, onSubmit, habitToEdit }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [time, setTime] = useState(getCurrentTimeString());
  const [priority, setPriority] = useState<Priority>(Priority.LOW);
  const [repeat, setRepeat] = useState<RepeatFrequency>(RepeatFrequency.NEVER);
  const [repeatDays, setRepeatDays] = useState<WeekDays>(initialWeekDays);

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setDate(habitToEdit.date);
      setTime(habitToEdit.time);
      setPriority(habitToEdit.priority);
      setRepeat(habitToEdit.repeat);
      setRepeatDays(habitToEdit.repeatDays || initialWeekDays);
    } else {
      setName('');
      setDate(getTodayDateString());
      setTime(getCurrentTimeString());
      setPriority(Priority.LOW);
      setRepeat(RepeatFrequency.NEVER);
      setRepeatDays(initialWeekDays);
    }
  }, [habitToEdit, isOpen]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    const habitData: Omit<Habit, 'id' | 'completed'> & { id?: string } = {
        name,
        date,
        time,
        priority,
        repeat,
    };
    if (habitToEdit) {
        habitData.id = habitToEdit.id;
    }
    if (repeat === RepeatFrequency.CUSTOM) {
        habitData.repeatDays = repeatDays;
    }
    onSubmit(habitData);
  }, [name, date, time, priority, repeat, repeatDays, habitToEdit, onSubmit]);

  const handleDayToggle = (day: keyof WeekDays) => {
    setRepeatDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg m-4 p-6 transform transition-all" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
          {habitToEdit ? 'Edit Reminder' : 'Add Reminder'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Reminder Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Time</label>
              <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
            <div className="mt-2 flex gap-2">
              {PRIORITY_OPTIONS.map(opt => (
                <button type="button" key={opt.value} onClick={() => setPriority(opt.value)} className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${priority === opt.value ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="repeat" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Repeat</label>
            <select id="repeat" value={repeat} onChange={(e) => setRepeat(e.target.value as RepeatFrequency)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
              {REPEAT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          
          {repeat === RepeatFrequency.CUSTOM && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">On these days</label>
              <div className="mt-2 grid grid-cols-4 sm:grid-cols-7 gap-2">
                {WEEK_DAYS_KEYS.map(day => (
                  <button type="button" key={day} onClick={() => handleDayToggle(day)} className={`px-2 py-2 text-sm font-medium rounded-md transition-colors capitalize ${repeatDays[day] ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;
