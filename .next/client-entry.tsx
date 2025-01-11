// This file is auto-generated. Do not edit it manually.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '../example/router';

import IndexPage from '../example/pages/index';
import AboutPage from '../example/pages/about';
import DocsPage from '../example/pages/docs';
import TodosPage from '../example/pages/todos';
import FeaturesPage from '../example/pages/features';

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Create React root
const root = createRoot(rootElement);

// Auto-generated routes
const routes = {
  '/': () => <IndexPage />,
  '/about': () => <AboutPage />,
  '/docs': () => <DocsPage />,
  '/todos': () => <TodosPage />,
  '/features': () => <FeaturesPage />
};

// Render the app
root.render(
  <React.StrictMode>
    <RouterProvider routes={routes} />
  </React.StrictMode>
);
