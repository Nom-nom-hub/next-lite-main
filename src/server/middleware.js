'use strict';

const path = require('path');
const fs = require('fs');

/**
 * Middleware handler
 * @param {Object} options - Middleware options
 * @param {string} options.dir - Root directory
 * @returns {Function} - Middleware handler function
 */
function createMiddlewareHandler({ dir }) {
  // Check if middleware file exists
  const middlewarePath = path.join(dir, 'middleware.js');
  if (!fs.existsSync(middlewarePath)) {
    // No middleware, return a pass-through handler
    return async (req, res, next) => {
      next();
    };
  }
  
  try {
    // Load middleware
    const middleware = require(middlewarePath);
    
    // Return middleware handler
    return async (req, res, next) => {
      try {
        // Create middleware response
        const middlewareRes = {
          cookies: new Map(),
          headers: new Map(),
          status: null,
          redirect: null,
          rewrite: null,
          body: null
        };
        
        // Create middleware context
        const context = {
          req,
          res: middlewareRes,
          next
        };
        
        // Call middleware
        await middleware.default(context);
        
        // Check if middleware handled the request
        if (middlewareRes.redirect) {
          // Handle redirect
          res.statusCode = middlewareRes.status || 307;
          res.setHeader('Location', middlewareRes.redirect);
          res.end();
          return;
        }
        
        if (middlewareRes.rewrite) {
          // Handle rewrite
          req.url = middlewareRes.rewrite;
        }
        
        if (middlewareRes.status) {
          // Set status code
          res.statusCode = middlewareRes.status;
        }
        
        // Set headers
        for (const [key, value] of middlewareRes.headers) {
          res.setHeader(key, value);
        }
        
        // Set cookies
        for (const [key, value] of middlewareRes.cookies) {
          const cookie = `${key}=${value}`;
          const cookies = res.getHeader('Set-Cookie') || [];
          res.setHeader('Set-Cookie', [...cookies, cookie]);
        }
        
        if (middlewareRes.body) {
          // Send response body
          res.end(middlewareRes.body);
          return;
        }
        
        // Continue to next handler
        next();
      } catch (error) {
        console.error('Error in middleware:', error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    };
  } catch (error) {
    console.error('Error loading middleware:', error);
    
    // Return error handler
    return async (req, res, next) => {
      res.statusCode = 500;
      res.end('Error loading middleware');
    };
  }
}

/**
 * Create a middleware API
 * @returns {Object} - Middleware API
 */
function createMiddlewareAPI() {
  return {
    /**
     * Redirect to a new URL
     * @param {string} url - URL to redirect to
     * @param {number} status - HTTP status code
     * @returns {Object} - Response object
     */
    redirect(url, status = 307) {
      return {
        redirect: url,
        status
      };
    },
    
    /**
     * Rewrite the request URL
     * @param {string} url - URL to rewrite to
     * @returns {Object} - Response object
     */
    rewrite(url) {
      return {
        rewrite: url
      };
    },
    
    /**
     * Set response headers
     * @param {Object} headers - Headers to set
     * @returns {Object} - Response object
     */
    headers(headers) {
      return {
        headers
      };
    },
    
    /**
     * Set response cookies
     * @param {Object} cookies - Cookies to set
     * @returns {Object} - Response object
     */
    cookies(cookies) {
      return {
        cookies
      };
    },
    
    /**
     * Set response status code
     * @param {number} status - HTTP status code
     * @returns {Object} - Response object
     */
    status(status) {
      return {
        status
      };
    },
    
    /**
     * Send a response body
     * @param {string} body - Response body
     * @returns {Object} - Response object
     */
    send(body) {
      return {
        body
      };
    }
  };
}

module.exports = {
  createMiddlewareHandler,
  createMiddlewareAPI
};
