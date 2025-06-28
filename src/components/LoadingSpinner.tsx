import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, progress }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-pulse"></div>
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      {message && (
        <p className="text-sm text-slate-700 font-semibold text-center max-w-md">{message}</p>
      )}
      {progress !== undefined && (
        <div className="w-80 bg-slate-200 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};