import { IncomingMessage, ServerResponse } from 'http';
import { NextApiHandler, NextApiRequest, NextApiResponse } from '../types';

// API route handler
export function createApiHandler(handler: NextApiHandler) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    // Enhance request object
    const enhancedReq = enhanceRequest(req);
    
    // Enhance response object
    const enhancedRes = enhanceResponse(res);
    
    try {
      // Call the handler
      await handler(enhancedReq, enhancedRes);
    } catch (error) {
      console.error('API route error:', error);
      
      // Send error response if not already sent
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    }
  };
}

// Enhance request object with Next.js-like properties
function enhanceRequest(req: IncomingMessage): NextApiRequest {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  
  // Parse query parameters
  const query: Record<string, string | string[]> = {};
  url.searchParams.forEach((value, key) => {
    if (query[key]) {
      if (Array.isArray(query[key])) {
        (query[key] as string[]).push(value);
      } else {
        query[key] = [query[key] as string, value];
      }
    } else {
      query[key] = value;
    }
  });
  
  // Parse cookies
  const cookies: Record<string, string> = {};
  const cookieHeader = req.headers.cookie || '';
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name) cookies[name] = value || '';
  });
  
  // Parse body (if available)
  let body: any = {};
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    // Body parsing would happen here
    // For now, we'll assume it's already parsed
  }
  
  return Object.assign(req, {
    query,
    cookies,
    body
  }) as NextApiRequest;
}

// Enhance response object with Next.js-like methods
function enhanceResponse(res: ServerResponse): NextApiResponse {
  // Add status method
  const status = (statusCode: number) => {
    res.statusCode = statusCode;
    return enhancedRes;
  };
  
  // Add json method
  const json = (data: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };
  
  // Add send method
  const send = (data: any) => {
    if (typeof data === 'object') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.end(String(data));
    }
  };
  
  // Add redirect method
  const redirect = (statusOrUrl: number | string, url?: string) => {
    if (typeof statusOrUrl === 'string') {
      res.statusCode = 307;
      res.setHeader('Location', statusOrUrl);
      res.end();
    } else {
      res.statusCode = statusOrUrl;
      res.setHeader('Location', url || '/');
      res.end();
    }
  };
  
  const enhancedRes = Object.assign(res, {
    status,
    json,
    send,
    redirect
  }) as NextApiResponse;
  
  return enhancedRes;
}
