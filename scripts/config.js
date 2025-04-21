/**
 * Configuration system for Next-Lite
 * Loads and validates the next-lite.config.js file
 */
const fs = require('fs-extra');
const path = require('path');

// Default configuration
const defaultConfig = {
  // Server configuration
  server: {
    port: 3000,
    host: 'localhost',
  },
  
  // Build configuration
  build: {
    target: 'es2015',
    minify: true,
    sourcemap: true,
    outDir: 'dist',
  },
  
  // Rendering options
  rendering: {
    ssr: false,
    staticExport: false,
  },
  
  // Image optimization
  images: {
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },
  
  // Environment variables
  env: {},
  
  // Internationalization
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  
  // Plugins
  plugins: [],
  
  // Middleware
  middleware: [],
  
  // Webpack configuration (for future use)
  webpack: (config) => config,
  
  // PostCSS configuration
  postcss: {
    plugins: [],
  },
};

/**
 * Load the configuration file
 * @returns {Object} The merged configuration
 */
function loadConfig() {
  const configPath = path.join(process.cwd(), 'next-lite.config.js');
  let userConfig = {};
  
  try {
    if (fs.existsSync(configPath)) {
      console.log('Loading configuration from next-lite.config.js');
      userConfig = require(configPath);
    } else {
      console.log('No configuration file found, using defaults');
    }
  } catch (error) {
    console.error('Error loading configuration:', error);
    console.log('Using default configuration');
  }
  
  // Deep merge the user config with the default config
  return deepMerge(defaultConfig, userConfig);
}

/**
 * Deep merge two objects
 * @param {Object} target - The target object
 * @param {Object} source - The source object
 * @returns {Object} The merged object
 */
function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Check if a value is an object
 * @param {*} item - The value to check
 * @returns {boolean} Whether the value is an object
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Validate the configuration
 * @param {Object} config - The configuration to validate
 * @returns {Object} The validated configuration
 */
function validateConfig(config) {
  // Validate server port
  if (typeof config.server.port !== 'number' || config.server.port < 0 || config.server.port > 65535) {
    console.warn('Invalid server port, using default (3000)');
    config.server.port = defaultConfig.server.port;
  }
  
  // Validate image domains
  if (!Array.isArray(config.images.domains)) {
    console.warn('Invalid image domains, using default ([])');
    config.images.domains = defaultConfig.images.domains;
  }
  
  // Validate i18n locales
  if (!Array.isArray(config.i18n.locales) || config.i18n.locales.length === 0) {
    console.warn('Invalid i18n locales, using default (["en"])');
    config.i18n.locales = defaultConfig.i18n.locales;
  }
  
  // Validate i18n defaultLocale
  if (!config.i18n.locales.includes(config.i18n.defaultLocale)) {
    console.warn(`Invalid i18n defaultLocale, using first locale (${config.i18n.locales[0]})`);
    config.i18n.defaultLocale = config.i18n.locales[0];
  }
  
  // Validate plugins
  if (!Array.isArray(config.plugins)) {
    console.warn('Invalid plugins, using default ([])');
    config.plugins = defaultConfig.plugins;
  }
  
  // Validate middleware
  if (!Array.isArray(config.middleware)) {
    console.warn('Invalid middleware, using default ([])');
    config.middleware = defaultConfig.middleware;
  }
  
  return config;
}

// Load and validate the configuration
const config = validateConfig(loadConfig());

module.exports = config;
