
import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
