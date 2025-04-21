const http = require('http');
const fs = require('fs-extra');
const path = require('path');
const APIRouter = require('./api-router');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check if SSR is enabled
const SSR_ENABLED = process.env.NEXT_LITE_SSR === 'true' || process.argv.includes('--ssr');

const DIST_DIR = path.join(process.cwd(), 'dist');
const API_DIR = path.join(DIST_DIR, 'api');
const SSR_DIR = path.join(DIST_DIR, 'ssr');
const STATIC_DIR = path.join(DIST_DIR, 'static');
const TEMPLATE_PATH = path.join(DIST_DIR, 'template.html');

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

// Load SSR module if enabled
let ssrModule;
if (SSR_ENABLED) {
  try {
    ssrModule = require('./ssr');
    console.log('✅ SSR enabled');
  } catch (error) {
    console.error('❌ Failed to load SSR module:', error);
    process.exit(1);
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(`[${req.method}] ${url.pathname}`);

  // Handle API routes
  if (url.pathname.startsWith('/api/')) {
    return apiRouter.handleRequest(req, res);
  }

  // Handle static files
  if (url.pathname.startsWith('/static/') ||
      url.pathname.startsWith('/public/') ||
      url.pathname.endsWith('.ico') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.svg')) {
    return serveStaticFile(req, res, url);
  }

  try {
    // For page routes, use SSR if enabled
    if (SSR_ENABLED && ssrModule) {
      return await handleSSR(req, res, url);
    }

    // Default to index.html for routes (client-side rendering)
    let filePath = path.join(DIST_DIR, url.pathname === '/' ? 'index.html' : url.pathname);

    // Check if file exists, if not serve template.html for client-side routing
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = TEMPLATE_PATH;
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

/**
 * Handle server-side rendering
 */
async function handleSSR(req, res, url) {
  const pathname = url.pathname;

  try {
    // Get the component for this route
    const { getComponentForPath } = require(path.join(SSR_DIR, 'routes'));
    const component = getComponentForPath(pathname);

    if (!component) {
      // No matching route, serve 404
      res.writeHead(404);
      res.end('404 Not Found');
      return;
    }

    // Get query parameters
    const query = {};
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    // Extract route parameters
    const params = {}; // In a real app, extract from pathname

    // Create context for data fetching
    const context = ssrModule.createDataFetchingContext(req, res, params, query);

    // Render the page
    const result = await ssrModule.renderPage(component, context);

    // Handle redirect
    if (result.redirect) {
      const { destination, permanent } = result.redirect;
      res.writeHead(permanent ? 301 : 302, {
        'Location': destination,
      });
      res.end();
      return;
    }

    // Handle not found
    if (result.notFound) {
      res.writeHead(404);
      res.end('404 Not Found');
      return;
    }

    // Normal response
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache',
    });
    res.end(result);
  } catch (error) {
    console.error(`Error during SSR for ${pathname}:`, error);

    // Fall back to client-side rendering
    const template = await fs.readFile(TEMPLATE_PATH, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(template);
  }
}

/**
 * Serve a static file
 */
async function serveStaticFile(req, res, url) {
  const pathname = url.pathname;
  let filePath;

  if (pathname.startsWith('/static/')) {
    filePath = path.join(DIST_DIR, pathname);
  } else if (pathname.startsWith('/public/')) {
    filePath = path.join(DIST_DIR, pathname);
  } else {
    // For other static files like favicon.ico
    filePath = path.join(DIST_DIR, 'public', pathname);
  }

  try {
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = await fs.readFile(filePath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000', // 1 year for static assets
    });
    res.end(content);
  } catch (error) {
    console.error(`Error serving static file ${pathname}:`, error);
    res.writeHead(500);
    res.end('500 Internal Server Error');
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
🚀 Production server running at:
   > Local:    http://localhost:${PORT}
   > Mode:     ${SSR_ENABLED ? 'Server-side rendering' : 'Client-side rendering'}
  `);
});
