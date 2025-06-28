import React from 'react';
import { RefreshCw, Clock, Activity } from 'lucide-react';

interface HeaderProps {
  title: string;
  version: string;
  description: string;
  onRefresh: () => void;
  lastFetched: Date | null;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  version,
  description,
  onRefresh,
  lastFetched,
  isLoading
}) => {
  return (
    <header className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16">
        <div className="mr-4 sm:mr-6 lg:mr-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8 mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                {/* CyberLine style logo */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                  <div className="absolute inset-0 rounded-xl border-2 border-gray-700/50 bg-gradient-to-br from-gray-800 to-black shadow-xl"></div>
                  <div className="absolute inset-2 rounded-lg border border-gray-600/30 bg-gradient-to-br from-gray-700 to-gray-900"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="https://cyberlineapi.vercel.app/favicon.ico" 
                      alt="Cyberline Logo" 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = '/favicon.ico';
                      }}
                    />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-red-200 bg-clip-text text-transparent mb-2 break-words">
                  {title}
                </h1>
                <p className="text-red-400 text-base sm:text-lg font-medium mb-3">Navigating the Digital Frontier</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-red-500/30 rounded-full text-sm font-medium text-red-300">
                      v{version}
                    </span>
                    <div className="flex items-center space-x-1 text-red-400 text-sm">
                      <Activity className="w-4 h-4" />
                      <span>Live</span>
                    </div>
                  </div>
                  {lastFetched && (
                    <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span className="hidden sm:inline">Updated {lastFetched.toLocaleTimeString()}</span>
                      <span className="sm:hidden">{lastFetched.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="group flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 border border-red-500/20 w-full sm:w-auto"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
              <span className="font-medium">Refresh</span>
            </button>
          </div>
          
          <div className="max-w-4xl">
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 text-center sm:text-left">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 justify-center sm:justify-start">
              <div className="flex items-center justify-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Real-time Updates</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-red-300">
                <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                <span className="text-sm font-medium">Interactive Testing</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-red-200">
                <div className="w-2 h-2 bg-red-200 rounded-full"></div>
                <span className="text-sm font-medium">Production Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};