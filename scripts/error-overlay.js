/**
 * Error overlay for development
 * This script injects an error overlay into the page when errors occur
 */

// Create and inject the error overlay styles
function injectErrorOverlayStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .next-lite-error-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.85);
      color: #ff5555;
      font-family: monospace;
      padding: 2rem;
      z-index: 9999;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }
    
    .next-lite-error-header {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #ff5555;
      border-bottom: 1px solid #ff5555;
      padding-bottom: 0.5rem;
    }
    
    .next-lite-error-message {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      color: #f8f8f2;
    }
    
    .next-lite-error-stack {
      font-size: 0.9rem;
      color: #f8f8f2;
      white-space: pre-wrap;
      background-color: #282a36;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .next-lite-error-file {
      font-size: 0.9rem;
      color: #8be9fd;
      margin-bottom: 0.5rem;
    }
    
    .next-lite-error-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      color: #f8f8f2;
      font-size: 1.5rem;
      cursor: pointer;
    }
    
    .next-lite-error-close:hover {
      color: #ff5555;
    }
  `;
  document.head.appendChild(style);
}

// Create and show the error overlay
function showErrorOverlay(error) {
  // Remove any existing overlay
  hideErrorOverlay();
  
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'next-lite-error-overlay';
  overlay.id = 'next-lite-error-overlay';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'next-lite-error-header';
  header.textContent = 'Next-Lite Build Error';
  overlay.appendChild(header);
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'next-lite-error-close';
  closeButton.textContent = '×';
  closeButton.onclick = hideErrorOverlay;
  overlay.appendChild(closeButton);
  
  // Create error message
  const message = document.createElement('div');
  message.className = 'next-lite-error-message';
  message.textContent = error.message || 'Unknown error';
  overlay.appendChild(message);
  
  // Create file info if available
  if (error.file) {
    const file = document.createElement('div');
    file.className = 'next-lite-error-file';
    file.textContent = `File: ${error.file}${error.line ? ` (${error.line}:${error.column || 0})` : ''}`;
    overlay.appendChild(file);
  }
  
  // Create stack trace
  if (error.stack) {
    const stack = document.createElement('pre');
    stack.className = 'next-lite-error-stack';
    stack.textContent = error.stack;
    overlay.appendChild(stack);
  }
  
  // Add to document
  document.body.appendChild(overlay);
  
  // Add keyboard handler to close on Escape
  document.addEventListener('keydown', handleKeyDown);
}

// Hide the error overlay
function hideErrorOverlay() {
  const overlay = document.getElementById('next-lite-error-overlay');
  if (overlay) {
    overlay.remove();
    document.removeEventListener('keydown', handleKeyDown);
  }
}

// Handle keyboard events
function handleKeyDown(event) {
  if (event.key === 'Escape') {
    hideErrorOverlay();
  }
}

// Initialize the error overlay
function initErrorOverlay() {
  injectErrorOverlayStyles();
  
  // Listen for error events from the WebSocket
  window.addEventListener('next-lite-build-error', (event) => {
    showErrorOverlay(event.detail);
  });
  
  // Also catch runtime errors
  window.addEventListener('error', (event) => {
    showErrorOverlay({
      message: event.message,
      stack: event.error?.stack,
      file: event.filename,
      line: event.lineno,
      column: event.colno
    });
  });
}

// Export the API
export {
  initErrorOverlay,
  showErrorOverlay,
  hideErrorOverlay
};
