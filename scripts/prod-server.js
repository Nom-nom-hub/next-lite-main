const http = require('http');
const fs = require('fs');
const path = require('path');
const APIRouter = require('./api-router');

const DIST_DIR = path.join(process.cwd(), 'dist');
const API_DIR = path.join(DIST_DIR, 'api');

// Initialize API Router
const apiRouter = new APIRouter(API_DIR);

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(`[${req.method}] ${url.pathname}`);

  // Handle API routes
  if (url.pathname.startsWith('/api/')) {
    return apiRouter.handleRequest(req, res);
  }

  try {
    // Default to index.html for routes
    let filePath = path.join(DIST_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
    
    // Check if file exists, if not serve index.html for client-side routing
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const content = await fs.promises.readFile(filePath);
    
    // Set cache headers for static assets
    const cacheControl = url.pathname.startsWith('/static/') 
      ? 'public, max-age=31536000' // 1 year for static assets
      : 'no-cache'; // No cache for dynamic routes

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
    });
    res.end(content);

  } catch (error) {
    console.error(`Error serving ${url.pathname}:`, error);
    
    if (error.code === 'ENOENT') {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      res.writeHead(500);
      res.end('500 Internal Server Error');
    }
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
🚀 Production server running at:
   > Local:    http://localhost:${PORT}
  `);
});
