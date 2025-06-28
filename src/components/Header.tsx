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
    <header className="relative bg-gradient-to-br from-black via-red-950 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {/* Cyberline Favicon Logo */}
              <div className="w-20 h-20 relative">
                <div className="absolute inset-0 rounded-full border-4 border-red-500 border-r-transparent animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-2 border-red-400 border-r-transparent animate-spin" style={{ animationDirection: 'reverse' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://cyberlineapi.vercel.app/favicon.ico" 
                    alt="Cyberline Logo" 
                    className="w-10 h-10 rounded-lg"
                    onError={(e) => {
                      // Fallback to local favicon if external fails
                      e.currentTarget.src = '/favicon.ico';
                    }}
                  />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-red-200 to-red-300 bg-clip-text text-transparent mb-2">
                {title}
              </h1>
              <p className="text-red-300 text-lg font-medium mb-3">Navigating the Digital Frontier</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-full text-sm font-medium text-red-300">
                    v{version}
                  </span>
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <Activity className="w-4 h-4" />
                    <span>Live</span>
                  </div>
                </div>
                {lastFetched && (
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Updated {lastFetched.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 border border-red-500/20"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
            <span className="font-medium">Refresh</span>
          </button>
        </div>
        
        <div className="max-w-4xl">
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {description}
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-red-400">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Real-time Updates</span>
            </div>
            <div className="flex items-center space-x-2 text-red-300">
              <div className="w-2 h-2 bg-red-300 rounded-full"></div>
              <span className="text-sm font-medium">Interactive Testing</span>
            </div>
            <div className="flex items-center space-x-2 text-red-200">
              <div className="w-2 h-2 bg-red-200 rounded-full"></div>
              <span className="text-sm font-medium">Production Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
