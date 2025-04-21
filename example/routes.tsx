// This file defines the routes for the application
// It will be used by both client and server rendering

import React from 'react';

// Import page components
// In a real app, these would be imported from the pages directory
import HomePage from './pages/index';
import AboutPage from './pages/about';
import FeaturesPage from './pages/features';

// Define routes
export const routes = {
  '/': () => <HomePage />,
  '/about': () => <AboutPage />,
  '/features': () => <FeaturesPage />,
};

// Export a function to get a component for a specific path
// This is useful for server-side rendering
export function getComponentForPath(path: string) {
  return routes[path] || null;
}
