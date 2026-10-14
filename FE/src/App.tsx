import React, { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard Web';

export const App: React.FC = () => {
  const getInitialState = () => {
    try {
      const savedUserStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (token && savedUserStr) {
        const user = JSON.parse(savedUserStr);
        return { page: 'dashboard' as const, email: user.email || '' };
      }
    } catch (_) {}
    return { page: 'login' as const, email: '' };
  };

  const initial = getInitialState();
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard'>(initial.page);
  const [userEmail, setUserEmail] = useState<string>(initial.email);

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserEmail('');
    setCurrentPage('login');
  };

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          userEmail={userEmail}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default App;
