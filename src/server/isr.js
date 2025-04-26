const fs = require('fs-extra');
const path = require('path');
const { renderToString } = require('react-dom/server');
const { loadPages } = require('./pages');

/**
 * Cache for ISR pages
 * Format: { [path]: { html: string, lastRevalidated: number, revalidate: number } }
 */
const isrCache = new Map();

/**
 * Check if a page needs revalidation
 * @param {string} pagePath - Path to the page
 * @returns {boolean} - Whether the page needs revalidation
 */
function shouldRevalidate(pagePath) {
  const cached = isrCache.get(pagePath);
  if (!cached) return true;
  
  const { lastRevalidated, revalidate } = cached;
  const now = Date.now();
  return now - lastRevalidated > revalidate * 1000;
}

/**
 * Render a page with ISR
 * @param {Object} options - Options for ISR
 * @param {string} options.pagePath - Path to the page
 * @param {Object} options.pageModule - Page module
 * @param {string} options.dir - Root directory
 * @returns {Promise<string>} - HTML content
 */
async function renderISRPage({ pagePath, pageModule, dir }) {
  // Check if we need to revalidate
  if (!shouldRevalidate(pagePath)) {
    return isrCache.get(pagePath).html;
  }
  
  try {
    const Page = pageModule.default;
    const getStaticProps = pageModule.getStaticProps;
    
    // Handle static props if available
    let props = {};
    let revalidate = 60; // Default revalidate time: 60 seconds
    
    if (typeof getStaticProps === 'function') {
      const staticProps = await getStaticProps();
      props = staticProps.props || {};
      
      // Get revalidate time if specified
      if (staticProps.revalidate && typeof staticProps.revalidate === 'number') {
        revalidate = staticProps.revalidate;
      }
    }
    
    // Render page to HTML
    const html = renderToString(Page(props));
    
    // Create full HTML
    const fullHtml = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Next-Lite App</title>
          <link rel="stylesheet" href="/static/styles.css" />
        </head>
        <body>
          <div id="root">${html}</div>
          <script src="/static/client.js"></script>
        </body>
      </html>`;
    
    // Update cache
    isrCache.set(pagePath, {
      html: fullHtml,
      lastRevalidated: Date.now(),
      revalidate
    });
    
    return fullHtml;
  } catch (error) {
    console.error(`❌ Failed to render ISR page ${pagePath}:`, error);
    throw error;
  }
}

/**
 * Setup ISR middleware
 * @param {Object} app - Express app
 * @param {string} dir - Root directory
 * @returns {Function} - Middleware function
 */
function setupISRMiddleware(app, dir) {
  return async function isrMiddleware(req, res, next) {
    try {
      // Only handle GET requests
      if (req.method !== 'GET') return next();
      
      // Load pages if not already loaded
      const pages = await loadPages(dir);
      
      // Check if this is a page route
      const route = req.path === '/' ? '/' : req.path;
      const pageModule = pages[route];
      
      if (!pageModule) return next();
      
      // Check if page has getStaticProps with revalidate
      if (pageModule.getStaticProps) {
        const html = await renderISRPage({
          pagePath: route,
          pageModule,
          dir
        });
        
        return res.send(html);
      }
      
      next();
    } catch (error) {
      console.error('ISR middleware error:', error);
      next(error);
    }
  };
}

module.exports = {
  setupISRMiddleware,
  renderISRPage
};