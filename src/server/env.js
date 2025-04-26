'use strict';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

/**
 * Load environment variables
 * @param {Object} options - Options for loading environment variables
 * @param {string} options.dir - Root directory
 * @param {boolean} options.dev - Whether to run in development mode
 * @returns {Object} - Environment variables
 */
function loadEnv({ dir, dev = false }) {
  // Load .env files
  const dotenvFiles = [
    // .env.$(environment).local
    path.join(dir, `.env.${process.env.NODE_ENV}.local`),
    // .env.local (only in development)
    dev && path.join(dir, '.env.local'),
    // .env.$(environment)
    path.join(dir, `.env.${process.env.NODE_ENV}`),
    // .env
    path.join(dir, '.env')
  ].filter(Boolean);
  
  // Load each .env file
  for (const dotenvFile of dotenvFiles) {
    if (fs.existsSync(dotenvFile)) {
      dotenv.config({ path: dotenvFile });
    }
  }
  
  // Get environment variables that should be exposed to the client
  const clientEnv = {};
  
  // Only expose variables that start with NEXT_PUBLIC_
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      clientEnv[key] = process.env[key];
    }
  });
  
  return {
    serverEnv: process.env,
    clientEnv
  };
}

/**
 * Get client-side environment variables
 * @returns {Object} - Client-side environment variables
 */
function getClientEnv() {
  // Get environment variables that should be exposed to the client
  const clientEnv = {};
  
  // Only expose variables that start with NEXT_PUBLIC_
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      clientEnv[key] = process.env[key];
    }
  });
  
  return clientEnv;
}

/**
 * Generate client-side environment variables script
 * @param {Object} clientEnv - Client-side environment variables
 * @returns {string} - JavaScript code
 */
function generateEnvScript(clientEnv) {
  return `
    window.__NEXT_LITE_ENV__ = ${JSON.stringify(clientEnv)};
  `;
}

module.exports = {
  loadEnv,
  getClientEnv,
  generateEnvScript
};
