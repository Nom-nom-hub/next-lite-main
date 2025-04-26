/**
 * Plugin system for Next-Lite
 */

/**
 * Plugin registry
 */
const plugins = new Map();

/**
 * Plugin hooks
 */
const hooks = {
  beforeBuild: [],
  afterBuild: [],
  beforeDev: [],
  afterDev: [],
  beforeRender: [],
  afterRender: [],
  beforeRoute: [],
  afterRoute: []
};

/**
 * Register a plugin
 * @param {string} name - Plugin name
 * @param {Object} plugin - Plugin object
 */
function registerPlugin(name, plugin) {
  if (plugins.has(name)) {
    console.warn(`Plugin "${name}" is already registered. Overwriting...`);
  }
  
  plugins.set(name, plugin);
  
  // Register hooks
  Object.keys(hooks).forEach(hookName => {
    if (typeof plugin[hookName] === 'function') {
      hooks[hookName].push(plugin[hookName]);
    }
  });
  
  console.log(`Plugin "${name}" registered successfully.`);
}

/**
 * Unregister a plugin
 * @param {string} name - Plugin name
 * @returns {boolean} - Whether the plugin was unregistered
 */
function unregisterPlugin(name) {
  const plugin = plugins.get(name);
  
  if (!plugin) {
    console.warn(`Plugin "${name}" is not registered.`);
    return false;
  }
  
  // Remove hooks
  Object.keys(hooks).forEach(hookName => {
    if (typeof plugin[hookName] === 'function') {
      hooks[hookName] = hooks[hookName].filter(fn => fn !== plugin[hookName]);
    }
  });
  
  plugins.delete(name);
  console.log(`Plugin "${name}" unregistered successfully.`);
  
  return true;
}

/**
 * Run a hook
 * @param {string} hookName - Hook name
 * @param {Object} context - Hook context
 * @returns {Promise<Object>} - Updated context
 */
async function runHook(hookName, context = {}) {
  if (!hooks[hookName]) {
    console.warn(`Hook "${hookName}" does not exist.`);
    return context;
  }
  
  let currentContext = { ...context };
  
  for (const hook of hooks[hookName]) {
    try {
      currentContext = await hook(currentContext) || currentContext;
    } catch (error) {
      console.error(`Error running hook "${hookName}":`, error);
    }
  }
  
  return currentContext;
}

/**
 * Load plugins from config
 * @param {string} dir - Root directory
 */
function loadPlugins(dir) {
  try {
    const configPath = path.join(dir, 'next-lite.config.js');
    if (!fs.existsSync(configPath)) {
      return;
    }
    
    const config = require(configPath);
    const pluginConfigs = config.plugins || [];
    
    pluginConfigs.forEach(pluginConfig => {
      try {
        let plugin;
        
        if (typeof pluginConfig === 'string') {
          // Load plugin from node_modules
          plugin = require(pluginConfig);
          registerPlugin(pluginConfig, plugin);
        } else if (typeof pluginConfig === 'object' && pluginConfig.name) {
          // Load plugin with options
          const { name, options } = pluginConfig;
          plugin = require(name);
          
          // Initialize plugin with options if it has an init method
          if (typeof plugin.init === 'function') {
            plugin.init(options);
          }
          
          registerPlugin(name, plugin);
        }
      } catch (error) {
        console.error(`Failed to load plugin "${pluginConfig}":`, error);
      }
    });
  } catch (error) {
    console.warn('Failed to load plugins:', error);
  }
}

module.exports = {
  registerPlugin,
  unregisterPlugin,
  runHook,
  loadPlugins
};