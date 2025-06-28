export interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  parameters?: Parameter[];
  responses?: Response[];
  examples?: Example[];
  tags?: string[];
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface Response {
  status: number;
  description: string;
  schema?: any;
  example?: any;
}

export interface Example {
  title: string;
  request?: any;
  response?: any;
}

export interface ApiDocumentation {
  title: string;
  version: string;
  description: string;
  baseUrl: string;
  endpoints: ApiEndpoint[];
  lastUpdated: string;
}