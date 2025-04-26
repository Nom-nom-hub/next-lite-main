import { createApiHandler } from 'next-lite-framework';
import { IncomingMessage, ServerResponse } from 'http';
import { NextApiHandler } from 'next-lite-framework';

// Mock IncomingMessage and ServerResponse
class MockIncomingMessage {
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

class MockServerResponse {
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
    this.body = body;
    this.headersSent = true;
  }
}

describe('API Route Handler', () => {
  it('enhances request and response objects', async () => {
    // Create mock handler
    const handler: NextApiHandler = (req, res) => {
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
    const req = new MockIncomingMessage({
      url: '/api/test?foo=bar',
      method: 'GET',
      headers: {
        'cookie': 'name=value'
      }
    }) as unknown as IncomingMessage;
    
    const res = new MockServerResponse() as unknown as ServerResponse;
    
    // Call API handler
    await apiHandler(req, res);
    
    // Check response
    expect(res.statusCode).toBe(200);
    expect(res.headers['Content-Type']).toBe('application/json');
    expect(res.body).toBe(JSON.stringify({ success: true }));
  });
  
  it('handles errors in handler', async () => {
    // Create mock handler that throws an error
    const handler: NextApiHandler = () => {
      throw new Error('Test error');
    };
    
    // Create API handler
    const apiHandler = createApiHandler(handler);
    
    // Create mock request and response
    const req = new MockIncomingMessage() as unknown as IncomingMessage;
    const res = new MockServerResponse() as unknown as ServerResponse;
    
    // Call API handler
    await apiHandler(req, res);
    
    // Check response
    expect(res.statusCode).toBe(500);
    expect(res.headers['Content-Type']).toBe('application/json');
    expect(res.body).toBe(JSON.stringify({ error: 'Internal Server Error' }));
  });
  
  it('parses query parameters correctly', async () => {
    // Create mock handler
    const handler: NextApiHandler = (req, res) => {
      expect(req.query).toEqual({
        foo: 'bar',
        baz: 'qux',
        array: ['1', '2', '3']
      });
      
      res.status(200).json({ success: true });
    };
    
    // Create API handler
    const apiHandler = createApiHandler(handler);
    
    // Create mock request with query parameters
    const req = new MockIncomingMessage({
      url: '/api/test?foo=bar&baz=qux&array=1&array=2&array=3'
    }) as unknown as IncomingMessage;
    
    const res = new MockServerResponse() as unknown as ServerResponse;
    
    // Call API handler
    await apiHandler(req, res);
    
    // Check response
    expect(res.statusCode).toBe(200);
  });
  
  it('parses cookies correctly', async () => {
    // Create mock handler
    const handler: NextApiHandler = (req, res) => {
      expect(req.cookies).toEqual({
        name: 'value',
        token: 'abc123'
      });
      
      res.status(200).json({ success: true });
    };
    
    // Create API handler
    const apiHandler = createApiHandler(handler);
    
    // Create mock request with cookies
    const req = new MockIncomingMessage({
      headers: {
        'cookie': 'name=value; token=abc123'
      }
    }) as unknown as IncomingMessage;
    
    const res = new MockServerResponse() as unknown as ServerResponse;
    
    // Call API handler
    await apiHandler(req, res);
    
    // Check response
    expect(res.statusCode).toBe(200);
  });
  
  it('supports different response methods', async () => {
    // Test status().json()
    const handler1: NextApiHandler = (req, res) => {
      res.status(201).json({ created: true });
    };
    
    const apiHandler1 = createApiHandler(handler1);
    const req1 = new MockIncomingMessage() as unknown as IncomingMessage;
    const res1 = new MockServerResponse() as unknown as ServerResponse;
    
    await apiHandler1(req1, res1);
    
    expect(res1.statusCode).toBe(201);
    expect(res1.headers['Content-Type']).toBe('application/json');
    expect(res1.body).toBe(JSON.stringify({ created: true }));
    
    // Test send() with object
    const handler2: NextApiHandler = (req, res) => {
      res.send({ message: 'Hello' });
    };
    
    const apiHandler2 = createApiHandler(handler2);
    const req2 = new MockIncomingMessage() as unknown as IncomingMessage;
    const res2 = new MockServerResponse() as unknown as ServerResponse;
    
    await apiHandler2(req2, res2);
    
    expect(res2.statusCode).toBe(200);
    expect(res2.headers['Content-Type']).toBe('application/json');
    expect(res2.body).toBe(JSON.stringify({ message: 'Hello' }));
    
    // Test send() with string
    const handler3: NextApiHandler = (req, res) => {
      res.send('Hello World');
    };
    
    const apiHandler3 = createApiHandler(handler3);
    const req3 = new MockIncomingMessage() as unknown as IncomingMessage;
    const res3 = new MockServerResponse() as unknown as ServerResponse;
    
    await apiHandler3(req3, res3);
    
    expect(res3.statusCode).toBe(200);
    expect(res3.headers['Content-Type']).toBe('text/plain');
    expect(res3.body).toBe('Hello World');
  });
});
