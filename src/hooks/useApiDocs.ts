import { useState, useEffect, useCallback } from 'react';
import { ApiDocumentation } from '../types/api';

export const useApiDocs = (apiUrl: string, refreshInterval: number = 30000) => {
  const [docs, setDocs] = useState<ApiDocumentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchDocs = useCallback(async () => {
    try {
      setError(null);
      
      console.log(`Fetching OpenAPI spec from: ${apiUrl}`);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched OpenAPI data:', data);
      
      // Transform OpenAPI spec to our format
      const transformedData: ApiDocumentation = {
        title: data.info?.title || 'API Documentation',
        version: data.info?.version || '1.0.0',
        description: data.info?.description || 'API Documentation',
        baseUrl: data.servers?.[0]?.url || apiUrl.replace('/openapi.json', ''),
        endpoints: transformOpenApiPaths(data.paths || {}),
        lastUpdated: new Date().toISOString(),
      };
      
      setDocs(transformedData);
      setLastFetched(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching documentation';
      setError(errorMessage);
      console.error('Error fetching docs:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const transformOpenApiPaths = (paths: any) => {
    const endpoints = [];
    
    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, details] of Object.entries(methods as any)) {
        if (typeof details === 'object' && details !== null) {
          endpoints.push({
            path,
            method: method.toUpperCase(),
            description: details.summary || details.description || `${method.toUpperCase()} ${path}`,
            parameters: transformParameters(details.parameters),
            responses: transformResponses(details.responses),
            examples: transformExamples(details.examples),
            tags: details.tags || []
          });
        }
      }
    }
    
    return endpoints;
  };

  const transformParameters = (parameters: any) => {
    if (!parameters || !Array.isArray(parameters)) return [];
    
    return parameters.map(param => ({
      name: param.name || 'unknown',
      type: param.schema?.type || param.type || 'string',
      required: param.required || false,
      description: param.description || 'No description available',
      example: param.example || param.schema?.example || param.schema?.default
    }));
  };

  const transformResponses = (responses: any) => {
    if (!responses) return [];
    
    return Object.entries(responses).map(([status, details]: [string, any]) => ({
      status: parseInt(status),
      description: details.description || `Response ${status}`,
      example: details.content?.['application/json']?.example || 
               details.content?.['application/json']?.schema?.example ||
               details.example
    }));
  };

  const transformExamples = (examples: any) => {
    if (!examples) return [];
    
    if (Array.isArray(examples)) {
      return examples;
    }
    
    return Object.entries(examples).map(([title, example]: [string, any]) => ({
      title,
      request: example.request || example.value,
      response: example.response
    }));
  };

  useEffect(() => {
    fetchDocs();
    
    // Set up real-time updates
    const interval = setInterval(fetchDocs, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchDocs, refreshInterval]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchDocs();
  }, [fetchDocs]);

  return { docs, loading, error, lastFetched, refetch };
};