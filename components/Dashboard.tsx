
import React, { useState, useCallback } from 'react';
import { Habit, Priority, RepeatFrequency } from '../types';
import Header from './Header';
import HabitItem from './HabitItem';
import HabitForm from './HabitForm';
import { PlusIcon } from './icons';

const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning Workout',
    date: '2024-07-28',
    time: '07:00',
    priority: Priority.HIGH,
    repeat: RepeatFrequency.DAILY,
    completed: true,
  },
  {
    id: '2',
    name: 'Drink 8 glasses of water',
    date: '2024-07-28',
    time: '09:00',
    priority: Priority.MEDIUM,
    repeat: RepeatFrequency.DAILY,
    completed: false,
  },
  {
    id: '3',
    name: 'Read for 30 minutes',
    date: '2024-07-28',
    time: '21:00',
    priority: Priority.LOW,
    repeat: RepeatFrequency.NEVER,
    completed: false,
  },
    {
    id: '4',
    name: 'Weekly project review',
    date: '2024-07-26',
    time: '16:00',
    priority: Priority.HIGH,
    repeat: RepeatFrequency.CUSTOM,
    repeatDays: { monday: false, tuesday: false, wednesday: false, thursday: false, friday: true, saturday: false, sunday: false },
    completed: true,
  },
];

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleAddHabit = useCallback(() => {
    setEditingHabit(null);
    setIsModalOpen(true);
  }, []);

  const handleEditHabit = useCallback((habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  }, []);

  const handleDeleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const handleToggleComplete = useCallback((id: string) => {
    setHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  }, []);

  const handleSaveHabit = useCallback((habit: Omit<Habit, 'id' | 'completed'> & { id?: string }) => {
    if (habit.id) {
      // Update
      setHabits(prev =>
        prev.map(h =>
          h.id === habit.id ? { ...h, ...habit, completed: h.completed } : h
        )
      );
    } else {
      // Add
      const newHabit: Habit = {
        ...habit,
        id: new Date().getTime().toString(),
        completed: false,
      };
      setHabits(prev => [newHabit, ...prev]);
    }
    setIsModalOpen(false);
  }, []);

  const sortedHabits = [...habits].sort((a, b) => {
    // Sort by completion status (incomplete first), then by time
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return a.time.localeCompare(b.time);
  });

  return (
    <>
      <Header onLogout={onLogout} />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Your Habits</h2>
          <button
            onClick={handleAddHabit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            New Reminder
          </button>
        </div>
        <div className="space-y-4">
          {habits.length > 0 ? (
             sortedHabits.map(habit => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onEdit={handleEditHabit}
                onDelete={handleDeleteHabit}
                onToggleComplete={handleToggleComplete}
              />
            ))
          ) : (
            <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No habits yet!</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Click "New Reminder" to start building a better you.</p>
            </div>
          )}
        </div>
      </main>
      <HabitForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveHabit}
        habitToEdit={editingHabit}
      />
    </>
  );
};

export default Dashboard;