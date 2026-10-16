'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#F7F5F0]">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 border-4 border-[#5C2D16] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-[#5C2D16]">Memuat MoneyMate Dashboard...</p>
      </div>
    </div>
  );
}
