// This file is auto-generated. Do not edit it manually.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '../example/router';

import AboutPage from '../example/pages/about';
import DocsPage from '../example/pages/docs';
import FeaturesPage from '../example/pages/features';
import IndexPage from '../example/pages/index';
import TodosPage from '../example/pages/todos';

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Create React root
const root = createRoot(rootElement);

// Auto-generated routes
const routes = {
  '/about': () => <AboutPage />,
  '/docs': () => <DocsPage />,
  '/features': () => <FeaturesPage />,
  '/': () => <IndexPage />,
  '/todos': () => <TodosPage />
};

// Render the app
root.render(
  <React.StrictMode>
    <RouterProvider routes={routes} />
  </React.StrictMode>
);
