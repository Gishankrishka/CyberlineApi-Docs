import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  availableMethods: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedMethod,
  onMethodChange,
  availableMethods
}) => {
  return (
    <div className="bg-black/60 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6">
        <div className="mr-4 sm:mr-6 lg:mr-8">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search endpoints, descriptions, or parameters..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm text-sm sm:text-base"
              />
            </div>
            
            <div className="flex items-center space-x-3 lg:flex-shrink-0">
              <Filter className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 lg:block hidden" />
              <select
                value={selectedMethod}
                onChange={(e) => onMethodChange(e.target.value)}
                className="w-full lg:w-auto px-3 sm:px-4 py-3 sm:py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-white backdrop-blur-sm min-w-[120px] sm:min-w-[140px] text-sm sm:text-base"
              >
                <option value="">All Methods</option>
                {availableMethods.map(method => (
                  <option key={method} value={method}>
                    {method.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};