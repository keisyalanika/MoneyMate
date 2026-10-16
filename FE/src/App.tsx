import React, { useState } from 'react';
import { LoginPage } from './views/LoginPage';
import { Dashboard } from './views/Dashboard Web';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard'>('login');
  const [userEmail, setUserEmail] = useState<string>('KeisyaExaHaniyah@gmail.com');

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
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
