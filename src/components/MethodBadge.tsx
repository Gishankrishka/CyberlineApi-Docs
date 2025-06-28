import React from 'react';

interface MethodBadgeProps {
  method: string;
}

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method }) => {
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'POST':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PUT':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'PATCH':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'DELETE':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${getMethodColor(method)} backdrop-blur-sm`}
    >
      {method.toUpperCase()}
    </span>
  );
};