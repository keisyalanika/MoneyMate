'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RegisterPage } from '../../src/views/RegisterPage';

export default function Page() {
  const router = useRouter();

  const handleRegisterSuccess = (email: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moneymate_user_email', email);
    }
    router.push('/dashboard');
  };

  const handleNavigateLogin = () => {
    router.push('/login');
  };

  return (
    <RegisterPage
      onRegisterSuccess={handleRegisterSuccess}
      onNavigateLogin={handleNavigateLogin}
    />
  );
}
