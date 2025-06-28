import React, { useState, useMemo } from 'react';
import { useApiDocs } from './hooks/useApiDocs';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { EndpointCard } from './components/EndpointCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorState } from './components/ErrorState';

const API_DOCS_URL = 'https://api.gishankrishka.dev/openapi.json';

function App() {
  const { docs, loading, error, lastFetched, refetch } = useApiDocs(API_DOCS_URL);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  const filteredEndpoints = useMemo(() => {
    if (!docs?.endpoints) return [];

    return docs.endpoints.filter(endpoint => {
      const matchesSearch = searchTerm === '' || 
        endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (endpoint.parameters?.some(param => 
          param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          param.description.toLowerCase().includes(searchTerm.toLowerCase())
        ));

      const matchesMethod = selectedMethod === '' || 
        endpoint.method.toLowerCase() === selectedMethod.toLowerCase();

      return matchesSearch && matchesMethod;
    });
  }, [docs?.endpoints, searchTerm, selectedMethod]);

  const availableMethods = useMemo(() => {
    if (!docs?.endpoints) return [];
    return [...new Set(docs.endpoints.map(endpoint => endpoint.method.toLowerCase()))];
  }, [docs?.endpoints]);

  if (loading && !docs) {
    return <LoadingSpinner />;
  }

  if (error && !docs) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!docs) {
    return <ErrorState error="No documentation available" onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black">
      <Header
        title={docs.title}
        version={docs.version}
        description={docs.description}
        onRefresh={refetch}
        lastFetched={lastFetched}
        isLoading={loading}
      />

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
        availableMethods={availableMethods}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {filteredEndpoints.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg sm:text-xl mb-2">No endpoints found</div>
            <p className="text-gray-500 text-sm sm:text-base">
              {searchTerm || selectedMethod 
                ? 'Try adjusting your search criteria'
                : 'No API endpoints are available'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                API Endpoints ({filteredEndpoints.length})
              </h2>
              {error && (
                <div className="text-red-300 text-xs sm:text-sm bg-red-900/30 border border-red-700 px-3 py-2 rounded-md">
                  Warning: Some data may be outdated due to connection issues
                </div>
              )}
            </div>
            
            <div className="grid gap-4 sm:gap-6">
              {filteredEndpoints.map((endpoint, index) => (
                <EndpointCard 
                  key={`${endpoint.method}-${endpoint.path}-${index}`} 
                  endpoint={endpoint}
                  baseUrl={docs.baseUrl}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-black/50 border-t border-red-900/30 text-gray-400 py-6 sm:py-8 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-xs sm:text-sm font-medium text-gray-300 text-center">
                Real-time API Documentation • Updates every 30 seconds
              </p>
            </div>
            {lastFetched && (
              <p className="text-xs text-gray-500 text-center">
                Last updated: {lastFetched.toLocaleString()}
              </p>
            )}
            <div className="pt-4 border-t border-red-900/30 text-center w-full">
              <p className="text-xs text-gray-400 mb-2">
                Powered by{' '}
                <a 
                  href="https://t.me/Cyberline_Official" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Cyberline
                </a>
                {' • © 2025 '}
                <a 
                  href="https://t.me/KrishDev" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Gishan Krishka
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;