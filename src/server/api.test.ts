// Mock the next-lite-framework
jest.mock('next-lite-framework', () => {
  return {
    createApiHandler: (handler: any) => {
      return async (req: any, res: any) => {
        // Enhance request object
        const enhancedReq = {
          ...req,
          query: {},
          cookies: {},
          body: {}
        };
        
        // Enhance response object
        const enhancedRes = {
          ...res,
          status: (code: number) => {
            res.statusCode = code;
            return enhancedRes;
          },
          json: (data: any) => {
            res.body = JSON.stringify(data);
            res.setHeader('Content-Type', 'application/json');
            res.end();
          },
          send: (data: any) => {
            if (typeof data === 'object') {
              res.body = JSON.stringify(data);
              res.setHeader('Content-Type', 'application/json');
            } else {
              res.body = String(data);
              res.setHeader('Content-Type', 'text/plain');
            }
            res.end();
          }
        };
        
        try {
          await handler(enhancedReq, enhancedRes);
        } catch (error) {
          console.error('API route error:', error);
          
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.body = JSON.stringify({ error: 'Internal Server Error' });
            res.end();
          }
        }
      };
    }
  };
});

import { createApiHandler } from 'next-lite-framework';

// Mock request and response
class MockRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  
  constructor(options: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
  } = {}) {
    this.url = options.url || '/';
    this.method = options.method || 'GET';
    this.headers = {
      host: 'localhost:3000',
      ...options.headers
    };
  }
}

class MockResponse {
  statusCode: number = 200;
  headers: Record<string, string> = {};
  body: any = null;
  headersSent: boolean = false;
  
  setHeader(name: string, value: string): void {
    this.headers[name] = value;
  }
  
  getHeader(name: string): string | undefined {
    return this.headers[name];
  }
  
  writeHead(statusCode: number, headers?: Record<string, string>): this {
    this.statusCode = statusCode;
    if (headers) {
      this.headers = { ...this.headers, ...headers };
    }
    this.headersSent = true;
    return this;
  }
  
  end(body?: any): void {
    if (body) {
      this.body = body;
    }
    this.headersSent = true;
  }
}

describe('API Route Handler', () => {
  it('enhances request and response objects', async () => {
    // Create mock handler
    const handler = (req: any, res: any) => {
      // Check enhanced request
      expect(req.query).toBeDefined();
      expect(req.cookies).toBeDefined();
      expect(req.body).toBeDefined();
      
      // Check enhanced response
      expect(typeof res.status).toBe('function');
      expect(typeof res.json).toBe('function');
      expect(typeof res.send).toBe('function');
      
      // Use enhanced methods
      res.status(200).json({ success: true });
    };
    
    // Create API handler
    const apiHandler = createApiHandler(handler);
    
    // Create mock request and response
    const req = new MockRequest({
      url: '/api/test?foo=bar',
      method: 'GET',
      headers: {
        'cookie': 'name=value'
      }
    });
    
    const res = new MockResponse();
    
    // Call API handler
    await apiHandler(req, res);
    
    // Check response
    expect(res.statusCode).toBe(200);
    expect(res.headers['Content-Type']).toBe('application/json');
    expect(res.body).toBe(JSON.stringify({ success: true }));
  });
  
  it('handles errors in handler', async () => {
    // Create mock handler that throws an error
    const handler = () => {
      throw new Error('Test error');
    };
    
    // Create API handler
    const apiHandler = createApiHandler(handler);
    
    // Create mock request and response
    const req = new MockRequest();
    const res = new MockResponse();
    
    // Call API handler
    await apiHandler(req, res);
    
    // Check response
    expect(res.statusCode).toBe(500);
    expect(res.headers['Content-Type']).toBe('application/json');
    expect(res.body).toBe(JSON.stringify({ error: 'Internal Server Error' }));
  });
});
