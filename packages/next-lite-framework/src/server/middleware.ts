import { NextApiRequest, NextApiResponse, NextMiddleware } from '../types';

// Middleware chain
export class MiddlewareChain {
  private middlewares: NextMiddleware[] = [];
  
  // Add middleware
  use(middleware: NextMiddleware) {
    this.middlewares.push(middleware);
    return this;
  }
  
  // Run middleware chain
  async run(req: NextApiRequest, res: NextApiResponse) {
    let index = 0;
    
    const next = async () => {
      // Get current middleware
      const middleware = this.middlewares[index];
      
      // Move to next middleware
      index++;
      
      // If middleware exists, call it
      if (middleware) {
        await middleware(req, res, next);
      }
    };
    
    // Start middleware chain
    await next();
  }
}

// Create middleware chain
export function createMiddleware() {
  return new MiddlewareChain();
}

// Common middlewares

// CORS middleware
export function cors(options: {
  origin?: string | string[] | boolean;
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
}) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    // Set CORS headers
    const origin = options.origin === true ? '*' : options.origin || '*';
    const methods = options.methods || 'GET,HEAD,PUT,PATCH,POST,DELETE';
    const allowedHeaders = options.allowedHeaders || '*';
    
    // Set headers
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', methods);
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders);
    
    if (options.exposedHeaders) {
      res.setHeader('Access-Control-Expose-Headers', options.exposedHeaders);
    }
    
    if (options.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    if (options.maxAge) {
      res.setHeader('Access-Control-Max-Age', options.maxAge.toString());
    }
    
    // Handle preflight request
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }
    
    // Continue to next middleware
    await next();
  };
}

// Body parser middleware
export function bodyParser() {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    // Only parse POST, PUT, PATCH requests
    if (
      req.method === 'POST' ||
      req.method === 'PUT' ||
      req.method === 'PATCH'
    ) {
      // Parse body
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('application/json')) {
        // Parse JSON body
        try {
          const chunks: Buffer[] = [];
          
          for await (const chunk of req) {
            chunks.push(Buffer.from(chunk));
          }
          
          const data = Buffer.concat(chunks).toString();
          req.body = JSON.parse(data);
        } catch (error) {
          console.error('Error parsing JSON body:', error);
          req.body = {};
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Parse form data
        try {
          const chunks: Buffer[] = [];
          
          for await (const chunk of req) {
            chunks.push(Buffer.from(chunk));
          }
          
          const data = Buffer.concat(chunks).toString();
          const params = new URLSearchParams(data);
          
          req.body = {};
          params.forEach((value, key) => {
            req.body[key] = value;
          });
        } catch (error) {
          console.error('Error parsing form data:', error);
          req.body = {};
        }
      }
    }
    
    // Continue to next middleware
    await next();
  };
}
