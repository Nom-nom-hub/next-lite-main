'use strict';

const { hydrate } = require('./hydrate');

/**
 * Client-side router
 */
class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = window.location.pathname;
    
    // Listen for popstate events
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }
  
  /**
   * Register a route
   * @param {string} path - Route path
   * @param {React.Component} component - React component for the route
   */
  register(path, component) {
    this.routes.set(path, component);
    return this;
  }
  
  /**
   * Start the router
   */
  start() {
    // Handle the initial route
    this.handleRoute(window.location.pathname);
  }
  
  /**
   * Handle a route
   * @param {string} path - Route path
   */
  handleRoute(path) {
    // Get the component for the route
    const component = this.routes.get(path);
    
    if (!component) {
      console.error(`No component registered for path "${path}"`);
      return;
    }
    
    // Update the current path
    this.currentPath = path;
    
    // Hydrate the component
    hydrate(component);
  }
  
  /**
   * Handle popstate events
   * @param {Event} event - Popstate event
   */
  handlePopState(event) {
    // Get the new path
    const path = window.location.pathname;
    
    // Handle the route
    this.handleRoute(path);
  }
  
  /**
   * Navigate to a route
   * @param {string} path - Route path
   * @param {Object} options - Navigation options
   * @param {boolean} options.replace - Whether to replace the current history entry
   */
  navigate(path, { replace = false } = {}) {
    // Update the history
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    
    // Handle the route
    this.handleRoute(path);
  }
}

// Create a singleton router instance
const router = new Router();

/**
 * Link component for client-side navigation
 * @param {Object} props - Component props
 * @param {string} props.href - Link URL
 * @param {boolean} props.replace - Whether to replace the current history entry
 * @param {React.ReactNode} props.children - Link children
 */
function Link({ href, replace = false, children, ...props }) {
  const handleClick = (event) => {
    // Allow the default behavior for external links
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return;
    }
    
    // Prevent the default behavior
    event.preventDefault();
    
    // Navigate to the route
    router.navigate(href, { replace });
  };
  
  return React.createElement('a', { href, onClick: handleClick, ...props }, children);
}

/**
 * Hook for accessing the router
 * @returns {Object} - Router object
 */
function useRouter() {
  return {
    pathname: router.currentPath,
    push: (path) => router.navigate(path),
    replace: (path) => router.navigate(path, { replace: true })
  };
}

module.exports = {
  Router,
  router,
  Link,
  useRouter
};
