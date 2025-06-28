import React, { useState } from 'react';
import { Play, Loader2, Download, ExternalLink, Eye, FileText, Image, Code, Globe } from 'lucide-react';
import { ApiEndpoint } from '../types/api';
import { CodeBlock } from './CodeBlock';

interface TryNowPanelProps {
  endpoint: ApiEndpoint;
  baseUrl: string;
}

interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  contentType: string;
  responseType: 'json' | 'image' | 'html' | 'xml' | 'csv' | 'text' | 'binary' | 'unknown';
  size: number;
  url?: string;
  rawText?: string;
}

export const TryNowPanel: React.FC<TryNowPanelProps> = ({ endpoint, baseUrl }) => {
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  const handleParameterChange = (paramName: string, value: string) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const buildUrl = () => {
    let url = `${baseUrl}${endpoint.path}`;
    
    // Replace path parameters
    Object.entries(parameters).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, encodeURIComponent(value));
    });

    // Add query parameters for GET requests
    if (endpoint.method === 'GET') {
      const queryParams = new URLSearchParams();
      endpoint.parameters?.forEach(param => {
        if (param.name in parameters && parameters[param.name]) {
          queryParams.append(param.name, parameters[param.name]);
        }
      });
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  };

  const detectResponseType = (contentType: string): ApiResponse['responseType'] => {
    const type = contentType.toLowerCase();
    
    if (type.includes('application/json')) return 'json';
    if (type.includes('text/html')) return 'html';
    if (type.includes('text/xml') || type.includes('application/xml')) return 'xml';
    if (type.includes('text/csv')) return 'csv';
    if (type.includes('text/')) return 'text';
    if (type.includes('image/')) return 'image';
    if (type.includes('application/pdf') || type.includes('application/octet-stream')) return 'binary';
    
    return 'unknown';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const executeRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const url = buildUrl();
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Add body for POST/PUT/PATCH requests
      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
        const bodyParams: Record<string, any> = {};
        endpoint.parameters?.forEach(param => {
          if (param.name in parameters && parameters[param.name]) {
            bodyParams[param.name] = parameters[param.name];
          }
        });
        
        if (Object.keys(bodyParams).length > 0) {
          options.body = JSON.stringify(bodyParams);
        }
      }

      const response = await fetch(url, options);
      const contentType = response.headers.get('content-type') || '';
      const responseType = detectResponseType(contentType);
      
      let data: any;
      let rawText: string = '';
      let objectUrl: string | undefined;
      let size: number = 0;

      // Handle different response types
      switch (responseType) {
        case 'json':
          rawText = await response.text();
          size = new Blob([rawText]).size;
          try {
            data = JSON.parse(rawText);
          } catch {
            data = rawText;
          }
          break;

        case 'image':
          const imageBlob = await response.blob();
          size = imageBlob.size;
          objectUrl = URL.createObjectURL(imageBlob);
          data = {
            type: 'image',
            contentType: contentType,
            size: size,
            url: objectUrl
          };
          rawText = `[Binary Image Data - ${formatFileSize(size)}]`;
          break;

        case 'html':
        case 'xml':
        case 'csv':
        case 'text':
          rawText = await response.text();
          size = new Blob([rawText]).size;
          data = rawText;
          break;

        case 'binary':
          const binaryBlob = await response.blob();
          size = binaryBlob.size;
          objectUrl = URL.createObjectURL(binaryBlob);
          data = {
            type: 'binary',
            contentType: contentType,
            size: size,
            url: objectUrl
          };
          rawText = `[Binary Data - ${formatFileSize(size)}]`;
          break;

        default:
          rawText = await response.text();
          size = new Blob([rawText]).size;
          data = rawText;
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        data: data,
        contentType: contentType,
        responseType: responseType,
        size: size,
        url: objectUrl,
        rawText: rawText
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadResponse = () => {
    if (!response) return;

    let blob: Blob;
    let filename: string;

    if (response.url) {
      // For binary/image data, fetch the blob from the URL
      fetch(response.url)
        .then(res => res.blob())
        .then(blob => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `response-${Date.now()}.${response.contentType.split('/')[1] || 'bin'}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    } else {
      // For text-based data
      blob = new Blob([response.rawText || ''], { type: response.contentType });
      const extension = response.responseType === 'json' ? 'json' : 
                      response.responseType === 'html' ? 'html' :
                      response.responseType === 'xml' ? 'xml' :
                      response.responseType === 'csv' ? 'csv' : 'txt';
      filename = `response-${Date.now()}.${extension}`;
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openInNewTab = () => {
    if (response?.url) {
      window.open(response.url, '_blank');
    } else if (response?.rawText) {
      const blob = new Blob([response.rawText], { type: response.contentType });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const getResponseIcon = (type: ApiResponse['responseType']) => {
    switch (type) {
      case 'json': return Code;
      case 'image': return Image;
      case 'html': return Globe;
      case 'xml': return FileText;
      case 'csv': return FileText;
      case 'text': return FileText;
      case 'binary': return Download;
      default: return FileText;
    }
  };

  const renderResponseContent = () => {
    if (!response) return null;

    const ResponseIcon = getResponseIcon(response.responseType);

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <h5 className="text-sm sm:text-md font-semibold text-gray-200">Response</h5>
            <div className="flex items-center space-x-2">
              <ResponseIcon className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                {response.responseType}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
              response.status >= 200 && response.status < 300
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : response.status >= 400
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {response.status} {response.statusText}
            </span>
            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-800/50 rounded break-all">
              {response.contentType}
            </span>
            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-800/50 rounded">
              {formatFileSize(response.size)}
            </span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                viewMode === 'preview' 
                  ? 'bg-red-600/20 text-red-300 border border-red-500/30' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                viewMode === 'raw' 
                  ? 'bg-red-600/20 text-red-300 border border-red-500/30' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Raw</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadResponse}
              className="flex items-center space-x-1 px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={openInNewTab}
              className="flex items-center space-x-1 px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open</span>
            </button>
          </div>
        </div>

        {/* Response Content */}
        {viewMode === 'preview' ? (
          <div className="bg-black/30 rounded-xl border border-red-900/30 overflow-hidden">
            {response.responseType === 'image' && response.url && (
              <div className="p-4 sm:p-6">
                <img
                  src={response.url}
                  alt="Response content"
                  className="w-full max-w-lg mx-auto rounded-lg border border-red-800/50 shadow-lg"
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                />
              </div>
            )}
            
            {response.responseType === 'html' && (
              <div className="p-4 sm:p-6">
                <iframe
                  srcDoc={response.data}
                  className="w-full h-96 border border-red-800/50 rounded-lg bg-white"
                  title="HTML Preview"
                />
              </div>
            )}
            
            {response.responseType === 'json' && (
              <CodeBlock
                code={JSON.stringify(response.data, null, 2)}
                language="json"
                title="JSON Response"
              />
            )}
            
            {['xml', 'csv', 'text'].includes(response.responseType) && (
              <CodeBlock
                code={response.data}
                language={response.responseType === 'xml' ? 'xml' : 'text'}
                title={`${response.responseType.toUpperCase()} Response`}
              />
            )}
            
            {response.responseType === 'binary' && (
              <div className="p-4 sm:p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-xl mb-4">
                  <Download className="w-8 h-8 text-red-400" />
                </div>
                <h6 className="text-gray-200 font-medium mb-2">Binary File</h6>
                <p className="text-gray-400 text-sm mb-4 break-words">
                  {response.contentType} • {formatFileSize(response.size)}
                </p>
                <button
                  onClick={downloadResponse}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Download File
                </button>
              </div>
            )}
            
            {response.responseType === 'unknown' && (
              <CodeBlock
                code={response.rawText || 'Unknown content type'}
                title="Raw Response"
              />
            )}
          </div>
        ) : (
          <CodeBlock
            code={response.rawText || ''}
            title="Raw Response Data"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h4 className="text-base sm:text-lg font-semibold text-white">Try This Endpoint</h4>
        <button
          onClick={executeRequest}
          disabled={loading}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-red-500/25 w-full sm:w-auto"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{loading ? 'Executing...' : 'Execute'}</span>
        </button>
      </div>

      {/* Parameters Input */}
      {endpoint.parameters && endpoint.parameters.length > 0 && (
        <div className="space-y-4">
          <h5 className="text-sm sm:text-md font-semibold text-gray-200">Parameters</h5>
          <div className="grid gap-4">
            {endpoint.parameters.map((param, index) => (
              <div key={index} className="space-y-2">
                <label className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-red-300 font-mono break-all">{param.name}</span>
                  <span className="text-gray-400">({param.type})</span>
                  {param.required && (
                    <span className="text-red-400 text-xs">*</span>
                  )}
                </label>
                <input
                  type="text"
                  value={parameters[param.name] || ''}
                  onChange={(e) => handleParameterChange(param.name, e.target.value)}
                  placeholder={param.example || `Enter ${param.name}`}
                  className="w-full px-3 py-2 bg-black/50 border border-red-800/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-white placeholder-gray-400 text-sm sm:text-base"
                />
                <p className="text-xs text-gray-400 break-words">{param.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request URL Preview */}
      <div className="space-y-2">
        <h5 className="text-sm sm:text-md font-semibold text-gray-200">Request URL</h5>
        <div className="bg-black/50 rounded-lg p-3 border border-red-800/50">
          <code className="text-red-300 text-xs sm:text-sm break-all">
            {endpoint.method} {buildUrl()}
          </code>
        </div>
      </div>

      {/* Response */}
      {response && renderResponseContent()}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <h5 className="text-red-400 font-semibold mb-2">Error</h5>
          <p className="text-red-300 text-sm break-words">{error}</p>
        </div>
      )}
    </div>
  );
};