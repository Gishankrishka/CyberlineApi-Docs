import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Code, FileText, Settings, Play } from 'lucide-react';
import { ApiEndpoint } from '../types/api';
import { MethodBadge } from './MethodBadge';
import { CodeBlock } from './CodeBlock';
import { TryNowPanel } from './TryNowPanel';

interface EndpointCardProps {
  endpoint: ApiEndpoint;
  baseUrl: string;
}

export const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint, baseUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'parameters' | 'responses' | 'examples' | 'try'>('parameters');

  const hasParameters = endpoint.parameters && endpoint.parameters.length > 0;
  const hasResponses = endpoint.responses && endpoint.responses.length > 0;
  const hasExamples = endpoint.examples && endpoint.examples.length > 0;

  const tabs = [
    { id: 'parameters', label: 'Parameters', icon: Settings, show: hasParameters },
    { id: 'responses', label: 'Responses', icon: FileText, show: hasResponses },
    { id: 'examples', label: 'Examples', icon: Code, show: hasExamples },
    { id: 'try', label: 'Try Now', icon: Play, show: true }
  ].filter(tab => tab.show);

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-red-900/30 hover:border-red-700/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/10">
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MethodBadge method={endpoint.method} />
            <div>
              <h3 className="text-lg font-semibold text-white font-mono">
                {endpoint.path}
              </h3>
              <p className="text-gray-300 mt-1">{endpoint.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
                setActiveTab('try');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-red-500/25"
            >
              <Play className="w-4 h-4" />
              <span>Try Now</span>
            </button>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-red-900/30">
          <div className="flex border-b border-red-900/30 bg-black/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-b-2 border-red-500 text-red-400 bg-red-500/10'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'parameters' && hasParameters && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Parameters</h4>
                <div className="space-y-3">
                  {endpoint.parameters!.map((param, index) => (
                    <div key={index} className="bg-black/40 rounded-xl p-4 border border-red-900/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-semibold text-red-300">
                            {param.name}
                          </span>
                          <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs border border-red-800/50">
                            {param.type}
                          </span>
                          {param.required && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{param.description}</p>
                      {param.example && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Example:</span>
                          <code className="block mt-1 bg-black/60 p-2 rounded border border-red-800/50 text-xs font-mono text-red-300">
                            {param.example}
                          </code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'responses' && hasResponses && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Responses</h4>
                <div className="space-y-4">
                  {endpoint.responses!.map((response, index) => (
                    <div key={index} className="border border-red-900/30 rounded-xl p-4 bg-black/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          response.status >= 200 && response.status < 300
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : response.status >= 400
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {response.status}
                        </span>
                        <span className="text-white font-medium">{response.description}</span>
                      </div>
                      {response.example && (
                        <CodeBlock
                          code={JSON.stringify(response.example, null, 2)}
                          title="Response Example"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'examples' && hasExamples && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-white">Examples</h4>
                {endpoint.examples!.map((example, index) => (
                  <div key={index} className="space-y-4">
                    <h5 className="text-md font-semibold text-gray-200">{example.title}</h5>
                    {example.request && (
                      <CodeBlock
                        code={JSON.stringify(example.request, null, 2)}
                        title="Request"
                      />
                    )}
                    {example.response && (
                      <CodeBlock
                        code={JSON.stringify(example.response, null, 2)}
                        title="Response"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'try' && (
              <TryNowPanel endpoint={endpoint} baseUrl={baseUrl} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};