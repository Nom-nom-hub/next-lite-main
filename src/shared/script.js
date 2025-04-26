'use strict';

const React = require('react');

/**
 * Script component with optimization features
 * @param {Object} props - Component props
 * @param {string} props.src - Script source URL
 * @param {string} props.strategy - Loading strategy (defer, async, lazyOnload, beforeInteractive, afterInteractive)
 * @param {Function} props.onLoad - Callback when script loads
 * @param {Function} props.onError - Callback when script fails to load
 * @param {boolean} props.preload - Whether to preload the script
 */
function Script({
  src,
  strategy = 'afterInteractive',
  onLoad,
  onError,
  preload = false,
  ...props
}) {
  const scriptRef = React.useRef(null);
  
  React.useEffect(() => {
    if (!src) return;
    
    // Skip if the script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      if (onLoad) onLoad();
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = src;
    
    // Set attributes
    if (props.id) script.id = props.id;
    if (props.type) script.type = props.type;
    if (props.nonce) script.nonce = props.nonce;
    if (props.crossOrigin) script.crossOrigin = props.crossOrigin;
    
    // Set loading strategy
    if (strategy === 'defer') {
      script.defer = true;
    } else if (strategy === 'async') {
      script.async = true;
    }
    
    // Set event handlers
    script.onload = () => {
      if (onLoad) onLoad();
    };
    
    script.onerror = () => {
      if (onError) onError();
    };
    
    // Add script to document
    if (strategy === 'lazyOnload') {
      // Add script when the window loads
      window.addEventListener('load', () => {
        document.body.appendChild(script);
      });
    } else if (strategy === 'beforeInteractive') {
      // Add script to head
      document.head.appendChild(script);
    } else if (strategy === 'afterInteractive') {
      // Add script to body
      document.body.appendChild(script);
    }
    
    // Save reference to script
    scriptRef.current = script;
    
    // Cleanup
    return () => {
      if (scriptRef.current) {
        scriptRef.current.onload = null;
        scriptRef.current.onerror = null;
      }
    };
  }, [src, strategy, onLoad, onError, props.id, props.type, props.nonce, props.crossOrigin]);
  
  // If preload is true, add a preload link
  if (preload) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('link', {
        rel: 'preload',
        href: src,
        as: 'script',
        ...props
      })
    );
  }
  
  // Otherwise, don't render anything on the server
  return null;
}

module.exports = {
  Script
};
