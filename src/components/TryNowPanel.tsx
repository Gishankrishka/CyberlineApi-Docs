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
            <span className="text-xs text-gray-400">
              {formatFileSize(response.size)}
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={downloadResponse}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Download response"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={openInNewTab}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Response content based on type */}
        <div className="bg-gray-900 rounded-lg border border-gray-700">
          {response.responseType === 'image' && response.url && (
            <div className="p-4">
              <img 
                src={response.url} 
                alt="API Response" 
                className="max-w-full h-auto rounded border border-gray-600"
              />
            </div>
          )}

          {response.responseType === 'html' && (
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 text-xs rounded ${
                    viewMode === 'preview'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Eye className="w-3 h-3 inline mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  className={`px-3 py-1 text-xs rounded ${
                    viewMode === 'raw'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Code className="w-3 h-3 inline mr-1" />
                  Raw
                </button>
              </div>
              
              {viewMode === 'preview' ? (
                <div 
                  className="bg-white rounded border border-gray-600 min-h-[200px]"
                  dangerouslySetInnerHTML={{ __html: response.data }}
                />
              ) : (
                <CodeBlock code={response.data} language="html" />
              )}
            </div>
          )}

          {['json', 'xml', 'csv', 'text'].includes(response.responseType) && (
            <div className="p-4">
              <CodeBlock 
                code={response.responseType === 'json' ? JSON.stringify(response.data, null, 2) : response.data}
                language={response.responseType === 'json' ? 'json' : response.responseType}
              />
            </div>
          )}

          {response.responseType === 'binary' && (
            <div className="p-4 text-center">
              <div className="text-gray-400 mb-4">
                <Download className="w-12 h-12 mx-auto mb-2" />
                <p>Binary file ({formatFileSize(response.size)})</p>
                <p className="text-sm text-gray-500">{response.contentType}</p>
              </div>
              <button
                onClick={downloadResponse}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Download File
              </button>
            </div>
          )}

          {response.responseType === 'unknown' && (
            <div className="p-4">
              <div className="text-gray-400 text-center mb-4">
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <p>Unknown content type: {response.contentType}</p>
              </div>
              <CodeBlock code={response.rawText || ''} language="text" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Play className="w-5 h-5 text-red-400" />
        <h4 className="text-lg font-semibold text-white">Try It Now</h4>
      </div>

      {/* Parameters */}
      {endpoint.parameters && endpoint.parameters.length > 0 && (
        <div className="space-y-4 mb-6">
          <h5 className="text-md font-semibold text-gray-200">Parameters</h5>
          {endpoint.parameters.map((param) => (
            <div key={param.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {param.name}
                {param.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={parameters[param.name] || ''}
                onChange={(e) => handleParameterChange(param.name, e.target.value)}
                placeholder={param.description || `Enter ${param.name}`}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {param.description && (
                <p className="text-xs text-gray-400">{param.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={executeRequest}
        disabled={loading}
        className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Executing...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Execute Request</span>
          </>
        )}
      </button>

      {/* URL Preview */}
      <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-600">
        <p className="text-xs text-gray-400 mb-1">Request URL:</p>
        <code className="text-sm text-green-400 break-all">{buildUrl()}</code>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="mt-6">
          {renderResponseContent()}
        </div>
      )}
    </div>
  );
};
