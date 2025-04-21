/**
 * Middleware system for Next-Lite
 * Allows for request processing before reaching the route handler
 */
const path = require('path');
const fs = require('fs-extra');
const config = require('./config');

// Default middleware
const defaultMiddleware = [
  // Logger middleware
  (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${req.method}] ${res.statusCode} ${req.url} - ${duration}ms`);
    });
    next();
  },
];

/**
 * Load middleware from the project
 * @returns {Array} Array of middleware functions
 */
function loadMiddleware() {
  const middlewarePath = path.join(process.cwd(), 'middleware.js');
  let userMiddleware = [];
  
  try {
    if (fs.existsSync(middlewarePath)) {
      console.log('Loading middleware from middleware.js');
      const middlewareModule = require(middlewarePath);
      
      if (Array.isArray(middlewareModule)) {
        userMiddleware = middlewareModule;
      } else if (typeof middlewareModule === 'function') {
        userMiddleware = [middlewareModule];
      } else if (middlewareModule.default) {
        if (Array.isArray(middlewareModule.default)) {
          userMiddleware = middlewareModule.default;
        } else if (typeof middlewareModule.default === 'function') {
          userMiddleware = [middlewareModule.default];
        }
      }
    }
  } catch (error) {
    console.error('Error loading middleware:', error);
  }
  
  // Add middleware from config
  const configMiddleware = config.middleware || [];
  
  // Combine all middleware
  return [...defaultMiddleware, ...userMiddleware, ...configMiddleware];
}

/**
 * Create middleware chain
 * @param {Array} middleware - Array of middleware functions
 * @returns {Function} Middleware chain function
 */
function createMiddlewareChain(middleware) {
  return function(req, res, next) {
    let index = 0;
    
    function runMiddleware() {
      // If we've run through all middleware, call the final handler
      if (index >= middleware.length) {
        return next();
      }
      
      const currentMiddleware = middleware[index];
      index++;
      
      try {
        // Call the current middleware with the next function
        currentMiddleware(req, res, runMiddleware);
      } catch (error) {
        console.error('Middleware error:', error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }
    
    // Start the middleware chain
    runMiddleware();
  };
}

/**
 * Apply middleware to a request
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Function} next - Function to call when middleware is complete
 */
function applyMiddleware(req, res, next) {
  const middleware = loadMiddleware();
  const chain = createMiddlewareChain(middleware);
  chain(req, res, next);
}

module.exports = {
  applyMiddleware,
  createMiddlewareChain,
  loadMiddleware,
};
