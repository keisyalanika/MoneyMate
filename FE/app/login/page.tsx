'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginPage } from '../../src/views/LoginPage';

export default function Page() {
  const router = useRouter();
  const handleLoginSuccess = (email: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('moneymate_user_email', email);
    }
    router.push('/dashboard');
  };

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
}
