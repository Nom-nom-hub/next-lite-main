/**
 * Script optimization utilities for Next-Lite
 */

/**
 * Loads a script with optimal loading strategy
 * @param {Object} options - Script options
 * @param {string} options.src - Script source URL
 * @param {string} options.strategy - Loading strategy (defer, async, lazy, eager)
 * @param {Function} options.onLoad - Callback when script loads
 * @param {Function} options.onError - Callback when script fails to load
 * @returns {HTMLScriptElement} - The created script element
 */
export function loadScript({ src, strategy = 'defer', onLoad, onError }) {
  const script = document.createElement('script');
  script.src = src;
  
  // Apply loading strategy
  switch (strategy) {
    case 'defer':
      script.defer = true;
      break;
    case 'async':
      script.async = true;
      break;
    case 'lazy':
      script.setAttribute('loading', 'lazy');
      break;
    case 'eager':
      // Default behavior, no attributes needed
      break;
    default:
      console.warn(`Unknown script loading strategy: ${strategy}`);
  }
  
  // Add event listeners
  if (onLoad) script.addEventListener('load', onLoad);
  if (onError) script.addEventListener('error', onError);
  
  // Append to document
  document.head.appendChild(script);
  
  return script;
}

/**
 * Script component for Next-Lite
 * @param {Object} props - Component props
 * @param {string} props.src - Script source URL
 * @param {string} props.strategy - Loading strategy
 * @param {Function} props.onLoad - Callback when script loads
 * @param {Function} props.onError - Callback when script fails to load
 */
export function Script({ src, strategy = 'defer', onLoad, onError }) {
  React.useEffect(() => {
    loadScript({ src, strategy, onLoad, onError });
  }, [src, strategy, onLoad, onError]);
  
  return null;
}

/**
 * Preconnect to origins for faster resource loading
 * @param {Array} origins - Array of origin URLs
 */
export function preconnectToOrigins(origins) {
  if (!origins || !Array.isArray(origins) || origins.length === 0) return;
  
  origins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
  });
}