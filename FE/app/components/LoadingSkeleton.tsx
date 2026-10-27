import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="p-5 space-y-5 max-w-7xl mx-auto w-full animate-pulse">
      <div className="h-8 bg-[#E5DDD8] rounded-xl w-64"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-[#E5DDD8] rounded-2xl"></div>
        <div className="h-32 bg-[#E5DDD8] rounded-2xl"></div>
        <div className="h-32 bg-[#E5DDD8] rounded-2xl"></div>
      </div>
      <div className="h-64 bg-[#E5DDD8] rounded-2xl"></div>
    </div>
  );
};
