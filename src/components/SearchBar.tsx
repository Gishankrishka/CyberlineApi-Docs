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
    <div className="bg-black/30 backdrop-blur-sm border-b border-red-900/30 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search endpoints, descriptions, or parameters..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-black/50 border border-red-800/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400 backdrop-blur-sm"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={selectedMethod}
              onChange={(e) => onMethodChange(e.target.value)}
              className="px-4 py-4 bg-black/50 border border-red-800/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-white backdrop-blur-sm min-w-[140px]"
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
  );
};