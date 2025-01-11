const fs = require('fs');
const path = require('path');

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
  
  function scan(dir, routePrefix = '') {
    console.log('Scanning directory:', dir);
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    console.log('Found entries:', entries.map(e => e.name));
    
    for (const entry of entries) {
      if (entry.name.startsWith('api') || entry.name.startsWith('_')) {
        console.log('Skipping:', entry.name);
        continue; // Skip API routes and special files
      }
      
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(pagesDir, fullPath)
        .replace(/\\/g, '/'); // Convert Windows paths to forward slashes
      
      if (entry.isDirectory()) {
        scan(fullPath, `${routePrefix}/${entry.name}`);
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
  console.log('Final imports:', Array.from(imports));
  return { routes, imports: Array.from(imports) };
}

function generateRouterCode(pagesDir) {
  console.log('Generating router code for:', pagesDir);
  const { routes, imports } = scanPagesDirectory(pagesDir);
  
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

// Render the app
root.render(
  <React.StrictMode>
    <RouterProvider routes={routes} />
  </React.StrictMode>
);
`;

  console.log('Generated code:', code);
  return code;
}

module.exports = { generateRouterCode };
