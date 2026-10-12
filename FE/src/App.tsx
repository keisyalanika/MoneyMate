import React, { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { logoutUser } from './services/api';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard'>(() => {
    return localStorage.getItem('token') ? 'dashboard' : 'login';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser).email || 'KeisyaExaHaniyah@gmail.com';
      } catch {
        return 'KeisyaExaHaniyah@gmail.com';
      }
    }
    return 'KeisyaExaHaniyah@gmail.com';
  });

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentPage('dashboard');
  };

  const handleRegisterSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentPage('login');
  };

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'register' && (
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateLogin={() => setCurrentPage('login')}
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
