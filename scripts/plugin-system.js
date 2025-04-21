/**
 * Plugin system for Next-Lite
 * Allows for extending the framework's functionality
 */
const fs = require('fs-extra');
const path = require('path');
const config = require('./config');

// Plugin hooks
const hooks = {
  // Build hooks
  beforeBuild: [],
  afterBuild: [],
  
  // Server hooks
  beforeServerStart: [],
  afterServerStart: [],
  
  // Request hooks
  beforeRequest: [],
  afterRequest: [],
  
  // Route hooks
  beforeRoute: [],
  afterRoute: [],
  
  // Render hooks
  beforeRender: [],
  afterRender: [],
  
  // Custom hooks
  custom: {},
};

/**
 * Register a plugin
 * @param {Object} plugin - Plugin object
 */
function registerPlugin(plugin) {
  if (!plugin || !plugin.name) {
    console.warn('Invalid plugin: missing name');
    return;
  }
  
  console.log(`Registering plugin: ${plugin.name}`);
  
  // Register hooks
  if (plugin.hooks) {
    Object.entries(plugin.hooks).forEach(([hookName, hookFn]) => {
      if (hooks[hookName]) {
        if (Array.isArray(hooks[hookName])) {
          hooks[hookName].push(hookFn);
        } else if (hookName === 'custom' && typeof hookFn === 'object') {
          // Register custom hooks
          Object.entries(hookFn).forEach(([customHookName, customHookFn]) => {
            if (!hooks.custom[customHookName]) {
              hooks.custom[customHookName] = [];
            }
            hooks.custom[customHookName].push(customHookFn);
          });
        }
      } else {
        console.warn(`Unknown hook: ${hookName}`);
      }
    });
  }
  
  // Initialize plugin
  if (typeof plugin.init === 'function') {
    try {
      plugin.init();
    } catch (error) {
      console.error(`Error initializing plugin ${plugin.name}:`, error);
    }
  }
}

/**
 * Load plugins from the project
 */
function loadPlugins() {
  // Load plugins from config
  const configPlugins = config.plugins || [];
  configPlugins.forEach(registerPlugin);
  
  // Load plugins from plugins directory
  const pluginsDir = path.join(process.cwd(), 'plugins');
  if (fs.existsSync(pluginsDir)) {
    try {
      const pluginFiles = fs.readdirSync(pluginsDir);
      
      pluginFiles.forEach(file => {
        if (file.endsWith('.js')) {
          try {
            const pluginPath = path.join(pluginsDir, file);
            const plugin = require(pluginPath);
            
            if (plugin.default) {
              registerPlugin(plugin.default);
            } else {
              registerPlugin(plugin);
            }
          } catch (error) {
            console.error(`Error loading plugin ${file}:`, error);
          }
        }
      });
    } catch (error) {
      console.error('Error loading plugins directory:', error);
    }
  }
}

/**
 * Apply hooks
 * @param {string} hookName - Name of the hook to apply
 * @param {any} data - Data to pass to the hook
 * @returns {Promise<any>} - Result of applying the hooks
 */
async function applyHooks(hookName, data) {
  if (hookName.startsWith('custom.')) {
    const customHookName = hookName.substring(7);
    const customHooks = hooks.custom[customHookName] || [];
    
    let result = data;
    for (const hook of customHooks) {
      try {
        result = await hook(result);
      } catch (error) {
        console.error(`Error applying custom hook ${customHookName}:`, error);
      }
    }
    
    return result;
  }
  
  const hookFns = hooks[hookName] || [];
  
  let result = data;
  for (const hook of hookFns) {
    try {
      result = await hook(result);
    } catch (error) {
      console.error(`Error applying hook ${hookName}:`, error);
    }
  }
  
  return result;
}

/**
 * Create a plugin
 * @param {Object} options - Plugin options
 * @returns {Object} - Plugin object
 */
function createPlugin(options) {
  if (!options || !options.name) {
    throw new Error('Plugin must have a name');
  }
  
  return {
    name: options.name,
    hooks: options.hooks || {},
    init: options.init,
  };
}

// Load plugins
loadPlugins();

module.exports = {
  registerPlugin,
  applyHooks,
  createPlugin,
  hooks,
};
