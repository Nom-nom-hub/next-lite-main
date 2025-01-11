const fs = require('fs');
const path = require('path');

class APIRouter {
  constructor(apiDirectory) {
    this.apiDirectory = apiDirectory;
    this.routes = new Map();
    this.loadRoutes();
  }

  loadRoutes() {
    if (!fs.existsSync(this.apiDirectory)) {
      return;
    }

    const loadRoutesRecursively = (dir, prefix = '/api') => {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          loadRoutesRecursively(filePath, `${prefix}/${file}`);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
          const routePath = prefix + '/' + file.replace(/\.(ts|js)$/, '');
          // Don't register route for index files with their directory name
          const finalPath = routePath.replace('/index', '') || '/';
          this.routes.set(finalPath, require(filePath));
        }
      });
    };

    loadRoutesRecursively(this.apiDirectory);
  }

  async handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    
    // Remove trailing slash for consistency
    const normalizedPath = pathname.endsWith('/') && pathname !== '/' 
      ? pathname.slice(0, -1) 
      : pathname;

    const handler = this.routes.get(normalizedPath);

    if (!handler) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not Found' }));
      return;
    }

    // Parse query parameters
    const queryParams = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // Parse body for POST/PUT requests
    let body = {};
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      try {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const data = Buffer.concat(chunks).toString();
        body = JSON.parse(data);
      } catch (error) {
        console.error('Error parsing request body:', error);
      }
    }

    // Enhanced request object
    const enhancedReq = {
      ...req,
      query: queryParams,
      body,
      params: {}, // For future use with dynamic routes
    };

    // Enhanced response object
    const enhancedRes = {
      ...res,
      status: (code) => {
        res.statusCode = code;
        return enhancedRes;
      },
      json: (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      },
      send: (data) => {
        if (typeof data === 'object') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } else {
          res.setHeader('Content-Type', 'text/plain');
          res.end(data.toString());
        }
      },
    };

    try {
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      // Handle OPTIONS requests for CORS
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      // Get the appropriate method handler
      const methodHandler = handler[req.method.toLowerCase()];
      if (!methodHandler) {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
      }

      // Execute the handler
      await methodHandler(enhancedReq, enhancedRes);
    } catch (error) {
      console.error('Error handling API request:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }
}

module.exports = APIRouter;
