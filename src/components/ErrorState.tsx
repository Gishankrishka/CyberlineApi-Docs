import React from 'react';
import { AlertCircle, RefreshCw, Code } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      <div className="text-center max-w-md">
        <div className="relative mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 border border-red-500/30 rounded-2xl">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center border border-red-600">
            <Code className="w-3 h-3 text-red-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Failed to Load Documentation</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">{error}</p>
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-red-500/25"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};