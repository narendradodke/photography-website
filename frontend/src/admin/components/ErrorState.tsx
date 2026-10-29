import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something Went Wrong',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
}) => {
  return (
    <div className="p-8 text-center bg-[#1A1111] border border-red-900/50 rounded flex flex-col items-center justify-center my-6">
      <div className="p-3 bg-red-500/10 text-red-400 rounded-full mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-lg text-white font-medium mb-1">{title}</h3>
      <p className="text-xs text-red-200/80 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors border border-neutral-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};

