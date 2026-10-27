'use client';

import React, { useState } from 'react';
import { LoginPage } from './views/LoginPage';
import { RegisterPage } from './views/RegisterPage';
import { Dashboard } from './views/Dashboard Web';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') ? 'dashboard' : 'login';
    }
    return 'login';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser).email || 'KeisyaExaHaniyah@gmail.com';
        } catch {
          return 'KeisyaExaHaniyah@gmail.com';
        }
      }
    }
    return 'KeisyaExaHaniyah@gmail.com';
  });

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('moneymate_user_email');
      localStorage.removeItem('moneymate_users_db');
      sessionStorage.clear();
    }
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
          onRegisterSuccess={() => setCurrentPage('login')}
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
