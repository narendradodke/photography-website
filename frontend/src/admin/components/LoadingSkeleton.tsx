import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-[#141414] border border-neutral-800 rounded divide-y divide-neutral-800 animate-pulse">
      <div className="h-10 bg-neutral-900/80"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <div className="h-4 bg-neutral-800 rounded w-1/4"></div>
          <div className="h-4 bg-neutral-800 rounded w-1/4"></div>
          <div className="h-4 bg-neutral-800 rounded w-1/6"></div>
          <div className="h-4 bg-neutral-800 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#141414] border border-neutral-800 rounded p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-neutral-800 rounded w-1/3"></div>
            <div className="w-8 h-8 rounded-full bg-neutral-800"></div>
          </div>
          <div className="h-8 bg-neutral-800 rounded w-1/2"></div>
          <div className="h-3 bg-neutral-800 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
};

