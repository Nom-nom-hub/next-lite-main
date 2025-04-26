const express = require('express');
const path = require('path');
const { createI18nMiddleware } = require('../i18n');
const { registerBuiltInApiRoutes } = require('./api-routes');
const { setupISRMiddleware } = require('./isr');

/**
 * Create and configure the Next-Lite server
 * @param {Object} options - Server options
 * @param {string} options.dir - Root directory
 * @param {number} options.port - Port to listen on
 * @returns {Object} - Express app
 */
function createServer({ dir, port = 3000 }) {
  const app = express();
  
  // Serve static files
  app.use('/static', express.static(path.join(dir, 'public')));
  
  // Setup i18n middleware
  app.use(createI18nMiddleware(dir));
  
  // Setup ISR middleware
  app.use(setupISRMiddleware(app, dir));
  
  // Register built-in API routes
  registerBuiltInApiRoutes(app, dir);
  
  // Handle API routes
  app.use('/api', (req, res, next) => {
    // Implementation for API routes
    // ...
    next();
  });
  
  // Handle page routes
  app.get('*', (req, res) => {
    // Implementation for page routes
    // ...
    res.send('Page content');
  });
  
  return app;
}

module.exports = {
  createServer
};