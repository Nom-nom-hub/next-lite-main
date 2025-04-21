import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { RouterProvider } from './router';

// Import routes
import { routes } from './routes';

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Check if we have SSR data
const hasSSRData = typeof window !== 'undefined' && window.__INITIAL_PROPS__;

// Hydrate or render based on SSR
if (hasSSRData) {
  // Hydrate the app with SSR data
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <RouterProvider 
        routes={routes} 
        initialPath={window.location.pathname}
        initialProps={window.__INITIAL_PROPS__}
      />
    </React.StrictMode>
  );
} else {
  // Regular client-side rendering
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider routes={routes} />
    </React.StrictMode>
  );
}
