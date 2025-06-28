import React from 'react';
import { Code } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-600/20 border-t-red-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Code className="w-6 h-6 text-red-400" />
          </div>
        </div>
        <p className="text-gray-300 text-lg font-medium">Loading documentation...</p>
        <p className="text-gray-500 text-sm mt-2">Fetching latest API specifications</p>
      </div>
    </div>
  );
};