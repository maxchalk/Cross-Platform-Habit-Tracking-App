
import React from 'react';
import { CheckCircleIcon } from './icons';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-8 h-8 text-sky-500" />
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">Habit Tracker</span>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
