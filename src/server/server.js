'use strict';

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { renderPage } = require('./render');

/**
 * Create a Next-Lite server
 * @param {Object} options - Server options
 * @param {string} options.dir - Root directory
 * @param {number} options.port - Port to listen on
 * @param {boolean} options.dev - Whether to run in development mode
 * @param {Object} options.i18n - Internationalization options
 * @param {string} options.i18n.defaultLocale - Default locale
 * @param {Array<string>} options.i18n.locales - Supported locales
 * @returns {Object} - Server instance
 */
function createServer({
  dir = process.cwd(),
  port = 3000,
  dev = false,
  i18n = { defaultLocale: 'en', locales: ['en'] }
}) {
  // Pages directory
  const pagesDir = path.join(dir, 'pages');

  // Static directory
  const staticDir = path.join(dir, 'public');

  // Build directory
  const buildDir = path.join(dir, '.next');

  // Load environment variables
  const { loadEnv } = require('./env');
  const { serverEnv, clientEnv } = loadEnv({ dir, dev });

  // Create middleware handler
  const { createMiddlewareHandler } = require('./middleware');
  const middlewareHandler = createMiddlewareHandler({ dir });

  // Create HTTP server
  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = url.parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Add query to request object
      req.query = query;

      // Handle i18n
      const { getLocaleFromRequest } = require('../shared/i18n');
      const locale = getLocaleFromRequest(req, i18n);

      // Add locale to request
      req.locale = locale;
      req.defaultLocale = i18n.defaultLocale;
      req.locales = i18n.locales;

      // Run middleware
      middlewareHandler(req, res, () => {
        try {
          // Handle static files
          if (pathname.startsWith('/static/') || pathname.startsWith('/_next/static/')) {
            return serveStatic(req, res, pathname, staticDir, buildDir);
          }

          // Handle API routes
          if (pathname.startsWith('/api/')) {
            return handleApiRoute(req, res, pathname, pagesDir);
          }

          // Handle page routes
          return handlePageRoute(req, res, pathname, pagesDir, buildDir, dev, i18n);
        } catch (error) {
          console.error('Error handling request:', error);
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      });
    } catch (error) {
      console.error('Error handling request:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  return {
    server,

    /**
     * Start the server
     * @returns {Promise} - Promise that resolves when the server starts
     */
    start() {
      return new Promise((resolve, reject) => {
        server.listen(port, err => {
          if (err) {
            reject(err);
            return;
          }
          console.log(`> Ready on http://localhost:${port}`);
          resolve();
        });
      });
    },

    /**
     * Stop the server
     * @returns {Promise} - Promise that resolves when the server stops
     */
    stop() {
      return new Promise((resolve, reject) => {
        server.close(err => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    }
  };
}

/**
 * Serve static files
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {string} pathname - URL pathname
 * @param {string} staticDir - Static files directory
 * @param {string} buildDir - Build directory
 */
function serveStatic(req, res, pathname, staticDir, buildDir) {
  // Remove leading slash and _next/static/ prefix
  let filePath;
  if (pathname.startsWith('/_next/static/')) {
    filePath = path.join(buildDir, 'static', pathname.replace('/_next/static/', ''));
  } else {
    filePath = path.join(staticDir, pathname.replace('/static/', ''));
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }

  // Get file extension
  const ext = path.extname(filePath).toLowerCase();

  // Set content type
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const contentType = contentTypes[ext] || 'application/octet-stream';

  // Read and serve the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }

    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
}

/**
 * Handle API routes
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {string} pathname - URL pathname
 * @param {string} pagesDir - Pages directory
 */
async function handleApiRoute(req, res, pathname, pagesDir) {
  // Convert pathname to file path
  const apiPath = path.join(pagesDir, pathname.replace(/\/$/, '') + '.js');

  // Check if API route exists
  if (!fs.existsSync(apiPath)) {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }

  try {
    // Import API handler
    const apiHandler = require(apiPath).default;

    // Call API handler
    await apiHandler(req, res);
  } catch (error) {
    console.error('Error handling API route:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

/**
 * Handle page routes
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {string} pathname - URL pathname
 * @param {string} pagesDir - Pages directory
 * @param {string} buildDir - Build directory
 * @param {boolean} dev - Whether to run in development mode
 * @param {Object} i18n - Internationalization options
 */
async function handlePageRoute(req, res, pathname, pagesDir, buildDir, dev, i18n) {
  // Normalize pathname
  const normalizedPathname = pathname === '/' ? '/index' : pathname.replace(/\/$/, '');

  // Convert pathname to file path
  const pagePath = path.join(pagesDir, normalizedPathname + '.js');

  // Check if page exists
  if (!fs.existsSync(pagePath)) {
    // Check for 404 page
    const notFoundPath = path.join(pagesDir, '404.js');
    if (fs.existsSync(notFoundPath)) {
      res.statusCode = 404;
      const html = await renderPage({ pagePath: notFoundPath, req, res });
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
      return;
    }

    // Default 404 response
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>404 - Page Not Found</h1>');
    return;
  }

  try {
    // Check if this is a static page with ISR
    const page = require(pagePath).default;

    if (page && page.getStaticProps) {
      // This is a static page
      const { serveWithRevalidation } = require('./incremental-regeneration');

      // Get the revalidation time
      let revalidate = 0;

      if (page.getStaticProps) {
        // Call getStaticProps to get the revalidation time
        const staticPropsResult = await page.getStaticProps({ params: {} });
        revalidate = staticPropsResult.revalidate || 0;
      }

      // If revalidate is set, use ISR
      if (revalidate > 0) {
        // Get the output path for this page
        const outputPath = path.join(buildDir, 'static', normalizedPathname, 'index.html');

        // Serve the page with revalidation
        const html = await serveWithRevalidation({
          outputPath,
          pagePath,
          params: {},
          revalidate,
          req,
          res
        });

        // Send the response
        res.setHeader('Content-Type', 'text/html');
        res.end(html);
        return;
      }
    }

    // If not a static page or no revalidation, render normally
    const html = await renderPage({ pagePath, req, res });

    // Send the response
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  } catch (error) {
    console.error('Error rendering page:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>500 - Internal Server Error</h1>');
  }
}

module.exports = {
  createServer
};
