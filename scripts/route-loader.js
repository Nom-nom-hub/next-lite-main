const fs = require('fs-extra');
const path = require('path');
const config = require('./config');

function generateImportStatement(relativePath, componentName) {
  // Remove the extension from the import path
  const importPath = '../example/pages/' + relativePath.replace(/\.[^/.]+$/, '');
  return `import ${componentName} from '${importPath}';`;
}

function generateRouteObject(routes) {
  const routeEntries = Object.entries(routes)
    .map(([route, componentName]) => `  '${route}': () => <${componentName} />`)
    .join(',\n');

  return `{\n${routeEntries}\n}`;
}

function toPascalCase(str) {
  return str
    .split('/')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function scanPagesDirectory(pagesDir) {
  console.log('Scanning pages directory:', pagesDir);
  const routes = {};
  const imports = new Set();
  const routeGroups = {};
  const routeMiddleware = {};

  function scan(dir, routePrefix = '') {
    console.log('Scanning directory:', dir);
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    console.log('Found entries:', entries.map(e => e.name));

    // Check for route group configuration
    const routeGroupConfigPath = path.join(dir, '_route-group.js');
    let groupConfig = null;

    if (fs.existsSync(routeGroupConfigPath)) {
      try {
        groupConfig = require(routeGroupConfigPath);
        console.log('Found route group config:', groupConfig);

        // Store the group configuration
        if (routePrefix) {
          routeGroups[routePrefix] = groupConfig;
        }
      } catch (error) {
        console.error('Error loading route group config:', error);
      }
    }

    // Check for middleware configuration
    const middlewareConfigPath = path.join(dir, '_middleware.js');
    if (fs.existsSync(middlewareConfigPath)) {
      try {
        const middleware = require(middlewareConfigPath);
        console.log('Found middleware for route:', routePrefix || '/');

        // Store the middleware configuration
        routeMiddleware[routePrefix || '/'] = middleware;
      } catch (error) {
        console.error('Error loading middleware config:', error);
      }
    }

    for (const entry of entries) {
      // Skip special files and directories
      if (entry.name.startsWith('api') ||
          entry.name.startsWith('_') ||
          entry.name === 'node_modules') {
        console.log('Skipping:', entry.name);
        continue;
      }

      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(pagesDir, fullPath)
        .replace(/\\/g, '/'); // Convert Windows paths to forward slashes

      if (entry.isDirectory()) {
        // Handle route groups
        const isRouteGroup = entry.name.startsWith('(') && entry.name.endsWith(')');

        if (isRouteGroup) {
          // Route groups don't affect the URL path
          const groupName = entry.name.slice(1, -1); // Remove parentheses
          console.log('Processing route group:', groupName);

          // Scan the group directory without adding to the route prefix
          scan(fullPath, routePrefix);
        } else {
          // Regular directory - add to route prefix
          scan(fullPath, `${routePrefix}/${entry.name}`);
        }
      } else {
        const ext = path.extname(entry.name);
        if (ext === '.tsx' || ext === '.jsx' || ext === '.js') {
          const routePath = routePrefix + '/' + entry.name.replace(/\.[^/.]+$/, '');
          const finalRoute = routePath === '/index' ? '/' : routePath;

          // Generate component name
          const componentName = toPascalCase(relativePath.replace(/\.[^/.]+$/, '')) + 'Page';

          console.log('Adding route:', {
            path: finalRoute,
            component: componentName,
            file: relativePath
          });

          // Add to routes
          routes[finalRoute] = componentName;

          // Add to imports
          imports.add(generateImportStatement(relativePath, componentName));
        }
      }
    }
  }

  scan(pagesDir);
  console.log('Final routes:', routes);
  console.log('Final route groups:', routeGroups);
  console.log('Final route middleware:', routeMiddleware);
  console.log('Final imports:', Array.from(imports));

  return {
    routes,
    imports: Array.from(imports),
    routeGroups,
    routeMiddleware
  };
}

function generateRouterCode(pagesDir) {
  console.log('Generating router code for:', pagesDir);
  const { routes, imports, routeGroups, routeMiddleware } = scanPagesDirectory(pagesDir);

  // Generate route groups code
  const routeGroupsCode = `const routeGroups = ${JSON.stringify(routeGroups, null, 2)};`;

  // Generate route middleware code
  const routeMiddlewareEntries = Object.entries(routeMiddleware)
    .map(([route, middleware]) => `  '${route}': require('${path.join(pagesDir, route === '/' ? '' : route, '_middleware.js').replace(/\\/g, '/')}')`)
    .join(',\n');

  const routeMiddlewareCode = `const routeMiddleware = {\n${routeMiddlewareEntries}\n};`;

  const code = `// This file is auto-generated. Do not edit it manually.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '../example/router';

${imports.join('\n')}

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Create React root
const root = createRoot(rootElement);

// Auto-generated routes
const routes = ${generateRouteObject(routes)};

// Route groups configuration
${routeGroupsCode}

// Route middleware
${Object.keys(routeMiddleware).length > 0 ? routeMiddlewareCode : '// No route middleware defined'}

// Render the app
root.render(
  <React.StrictMode>
    <RouterProvider
      routes={routes}
      routeGroups={routeGroups}
      routeMiddleware={${Object.keys(routeMiddleware).length > 0 ? 'routeMiddleware' : '{}'}}
    />
  </React.StrictMode>
);
`;

  console.log('Generated code:', code);
  return code;
}

module.exports = {
  generateRouterCode,
  scanPagesDirectory
};
