/**
 * Hot Module Replacement (HMR) Runtime
 * Handles live updates without full page reloads
 */

// Map of module IDs to their accept handlers
const moduleMap = new Map();
// Current connection to the HMR server
let hmrSocket = null;
// Loading overlay for errors and reconnections
let loadingOverlay = null;

/**
 * Create a loading overlay for HMR status messages
 * @returns {Object} - Overlay controller
 */
function createLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.background = 'rgba(0, 0, 0, 0.85)';
  overlay.style.color = 'white';
  overlay.style.fontFamily = 'monospace';
  overlay.style.padding = '20px';
  overlay.style.zIndex = '9999';
  overlay.style.transition = 'opacity 0.3s ease';
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';
  
  const message = document.createElement('div');
  message.style.fontSize = '16px';
  overlay.appendChild(message);
  
  document.body.appendChild(overlay);
  
  return {
    setMessage: (text) => {
      message.textContent = text;
    },
    show: () => {
      overlay.style.opacity = '1';
    },
    hide: () => {
      overlay.style.opacity = '0';
    },
    remove: () => {
      document.body.removeChild(overlay);
    }
  };
}

/**
 * Connect to the HMR WebSocket server
 */
function connect() {
  if (hmrSocket) {
    hmrSocket.close();
  }
  
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = location.hostname;
  const port = process.env.HMR_PORT || location.port;
  
  hmrSocket = new WebSocket(`${protocol}//${host}:${port}/__hmr`);
  
  hmrSocket.onopen = () => {
    console.log('[HMR] Connected');
    if (loadingOverlay) {
      loadingOverlay.hide();
      setTimeout(() => loadingOverlay.remove(), 300);
      loadingOverlay = null;
    }
  };
  
  hmrSocket.onclose = () => {
    console.log('[HMR] Disconnected. Attempting to reconnect...');
    if (!loadingOverlay) {
      loadingOverlay = createLoadingOverlay();
      loadingOverlay.setMessage('Disconnected from dev server. Reconnecting...');
      loadingOverlay.show();
    }
    
    // Try to reconnect
    setTimeout(connect, 1000);
  };
  
  hmrSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('[HMR] Received:', data);
    
    if (!loadingOverlay) {
      loadingOverlay = createLoadingOverlay();
    }
    
    switch (data.type) {
      case 'update':
        // Handle module update
        handleUpdate(data);
        break;
        
      case 'reload':
        // Full page reload required
        console.log('[HMR] Reloading due to change in:', data.file);
        loadingOverlay.setMessage('Reloading...');
        loadingOverlay.show();
        
        // Add a small delay before reloading to show the overlay
        setTimeout(() => {
          window.location.reload();
        }, 300);
        break;
        
      case 'error':
        // Build error
        console.error('[HMR] Build error:', data.error);
        loadingOverlay.setMessage('Build Error! Check console.');
        loadingOverlay.show();
        setTimeout(() => loadingOverlay.hide(), 2000);
        break;
    }
  };
}

/**
 * Handle module updates
 * @param {Object} data - Update data
 */
function handleUpdate(data) {
  const { moduleId, update } = data;
  
  if (moduleMap.has(moduleId)) {
    const handlers = moduleMap.get(moduleId);
    
    try {
      // Execute the updated module code
      const updatedModule = eval(update);
      
      // Call accept handlers
      handlers.forEach(handler => handler(updatedModule));
      
      console.log(`[HMR] Module ${moduleId} updated successfully`);
    } catch (error) {
      console.error(`[HMR] Failed to update module ${moduleId}:`, error);
      
      // Show error and reload
      if (loadingOverlay) {
        loadingOverlay.setMessage('Update failed. Reloading...');
        loadingOverlay.show();
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  } else {
    // Module doesn't have accept handlers, reload page
    window.location.reload();
  }
}

/**
 * Register a module for HMR
 * @param {string} moduleId - Module identifier
 * @param {Function} acceptHandler - Handler for updates
 */
export function register(moduleId, acceptHandler) {
  if (!moduleMap.has(moduleId)) {
    moduleMap.set(moduleId, []);
  }
  
  moduleMap.get(moduleId).push(acceptHandler);
}

// Initialize HMR when in development mode
if (process.env.NODE_ENV === 'development') {
  // Connect to HMR server
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      connect();
    });
  }
}

export default {
  register
};