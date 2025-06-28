import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'json', title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="bg-black/60 rounded-xl overflow-hidden border border-gray-700/50 mr-4 sm:mr-6 lg:mr-8">
      {title && (
        <div className="px-4 py-3 bg-black/40 border-b border-gray-700/50 flex items-center justify-between">
          <span className="text-gray-300 text-sm font-medium">{title}</span>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1 text-gray-400 hover:text-white transition-colors duration-200 rounded-md hover:bg-red-900/20"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <pre className="p-4 min-w-0">
          <code className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};