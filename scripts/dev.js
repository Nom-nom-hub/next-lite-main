const path = require('path');
const fs = require('fs-extra');
const esbuild = require('esbuild');
const chokidar = require('chokidar');
const WebSocket = require('ws');
const express = require('express');
const { cssModulesPlugin } = require('./css-modules-plugin');

// Create WebSocket server for HMR
const wss = new WebSocket.Server({ noServer: true });
// Track module dependencies
const moduleDependencies = new Map();
// Track file to module ID mapping
const fileToModuleId = new Map();

/**
 * Start development server
 */
async function startDevServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  
  // Create client entry
  const clientEntry = path.join(process.cwd(), '.next', 'client-entry.js');
  await generateClientEntry();
  
  // Setup esbuild context
  let context;
  
  // Start esbuild
  try {
    console.log('[Build] Starting esbuild...');
    context = await esbuild.context({
      entryPoints: [clientEntry],
      bundle: true,
      outfile: path.join(process.cwd(), '.next', 'static', 'client.js'),
      format: 'esm',
      platform: 'browser',
      target: 'es2015',
      jsx: 'automatic',
      jsxImportSource: 'react',
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.css': 'css'
      },
      define: {
        'process.env.NODE_ENV': '"development"',
        'process.env.HMR_PORT': port.toString()
      },
      plugins: [
        cssModulesPlugin(),
        hmrPlugin()
      ],
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      splitting: false,
      sourcemap: true,
      minify: false,
      metafile: true,
    });
    
    // Initial build
    const result = await context.rebuild();
    
    // Track dependencies from metafile
    if (result.metafile) {
      updateDependencyMap(result.metafile);
    }
    
    console.log('[Build] Initial build complete');
  } catch (error) {
    console.error('[Build] Failed:', error);
    process.exit(1);
  }
  
  // Serve static files
  app.use('/_next/static', express.static(path.join(process.cwd(), '.next', 'static')));
  
  // Serve HTML
  app.get('*', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Next-Lite App</title>
        </head>
        <body>
          <div id="root"></div>
          <script src="/_next/static/client.js"></script>
        </body>
      </html>
    `);
  });
  
  // Start server
  const server = app.listen(port, () => {
    console.log(`[Server] Development server running at http://localhost:${port}`);
  });
  
  // Setup WebSocket server
  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/__hmr') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });
  
  // Watch for file changes
  const watcher = chokidar.watch([
    path.join(process.cwd(), 'pages', '**/*.{js,jsx,ts,tsx}'),
    path.join(process.cwd(), 'components', '**/*.{js,jsx,ts,tsx}'),
    path.join(process.cwd(), 'styles', '**/*.css')
  ], {
    ignored: /(^|[\/\\])\../, // Ignore dotfiles
    persistent: true
  });
  
  watcher.on('change', async (filename) => {
    console.log(`[HMR] File changed: ${filename}`);
    
    try {
      // Regenerate client entry if needed
      if (filename.includes('pages/')) {
        console.log('[HMR] Regenerating routes...');
        await generateClientEntry();
      }
      
      // Rebuild the project
      console.log('[HMR] Rebuilding...');
      const result = await context.rebuild();
      console.log('[HMR] Build complete');
      
      // Update dependency map
      if (result.metafile) {
        updateDependencyMap(result.metafile);
      }
      
      // Check if we can do HMR or need a full reload
      const moduleId = fileToModuleId.get(filename);
      
      if (moduleId) {
        // Get the updated module code
        const moduleCode = await fs.readFile(filename, 'utf8');
        
        // Send HMR update
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'update',
              moduleId,
              update: moduleCode
            }));
          }
        });
      } else {
        // Full reload required
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'reload',
              file: filename
            }));
          }
        });
      }
    } catch (error) {
      console.error('[HMR] Build failed:', error);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'error',
            error: error.message
          }));
        }
      });
    }
  });
  
  process.on('SIGINT', () => {
    watcher.close();
    server.close();
    process.exit(0);
  });
}

/**
 * Update dependency map from metafile
 * @param {Object} metafile - esbuild metafile
 */
function updateDependencyMap(metafile) {
  moduleDependencies.clear();
  fileToModuleId.clear();
  
  // Process outputs
  for (const [outputFile, output] of Object.entries(metafile.outputs)) {
    // Process inputs
    for (const [inputFile, input] of Object.entries(output.inputs)) {
      const normalizedPath = path.normalize(inputFile);
      
      // Generate a module ID
      const moduleId = path.relative(process.cwd(), normalizedPath);
      
      // Map file to module ID
      fileToModuleId.set(normalizedPath, moduleId);
      
      // Track dependencies
      if (!moduleDependencies.has(moduleId)) {
        moduleDependencies.set(moduleId, new Set());
      }
      
      // Add imports as dependencies
      if (input.imports) {
        for (const imp of input.imports) {
          const depId = path.relative(process.cwd(), imp.path);
          moduleDependencies.get(moduleId).add(depId);
        }
      }
    }
  }
}

/**
 * Generate client entry file
 */
async function generateClientEntry() {
  const pagesDir = path.join(process.cwd(), 'pages');
  const outputDir = path.join(process.cwd(), '.next');
  
  // Ensure output directory exists
  await fs.ensureDir(outputDir);
  
  // Get all page files
  const pageFiles = await getPageFiles(pagesDir);
  
  // Generate routes map
  const routes = pageFiles.map(file => {
    const route = file
      .replace(/\.(js|jsx|ts|tsx)$/, '')
      .replace(/\/index$/, '/')
      .replace(/\[([^\]]+)\]/g, ':$1');
    
    return {
      route: route === '' ? '/' : `/${route}`,
      component: file
    };
  });
  
  // Generate client entry
  const clientEntry = `
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import hmr from '../src/client/hmr';
    
    // Import pages
    ${routes.map((route, index) => 
      `import Page${index} from '../pages/${route.component}';`
    ).join('\n')}
    
    // Register pages for HMR
    ${routes.map((route, index) => 
      `hmr.register('pages/${route.component}', (updatedModule) => {
        Page${index} = updatedModule.default || updatedModule;
        renderApp();
      });`
    ).join('\n')}
    
    function App() {
      return (
        <BrowserRouter>
          <Routes>
            ${routes.map((route, index) => 
              `<Route path="${route.route}" element={<Page${index} />} />`
            ).join('\n')}
          </Routes>
        </BrowserRouter>
      );
    }
    
    let root;
    
    function renderApp() {
      if (!root) {
        root = createRoot(document.getElementById('root'));
      }
      root.render(<App />);
    }
    
    renderApp();
  `;
  
  // Write client entry
  await fs.writeFile(path.join(outputDir, 'client-entry.js'), clientEntry);
}

/**
 * Get all page files in a directory
 * @param {string} dir - Directory to search
 * @param {string} prefix - Prefix for recursive calls
 * @returns {Promise<Array<string>>} - Paths to page files
 */
async function getPageFiles(dir, prefix = '') {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    const files = [];
    
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip API routes
        if (entry.name === 'api') continue;
        
        // Recursively get files in subdirectories
        const subFiles = await getPageFiles(entryPath, path.join(prefix, entry.name));
        files.push(...subFiles);
      } else if (
        entry.name.endsWith('.js') || 
        entry.name.endsWith('.jsx') || 
        entry.name.endsWith('.ts') || 
        entry.name.endsWith('.tsx')
      ) {
        // Skip special files
        if (entry.name.startsWith('_')) continue;
        
        // Add page files
        files.push(path.join(prefix, entry.name));
      }
    }
    
    return files;
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

/**
 * HMR plugin for esbuild
 */
function hmrPlugin() {
  return {
    name: 'hmr-plugin',
    setup(build) {
      // Add HMR code to modules
      build.onLoad({ filter: /\.(js|jsx|ts|tsx)$/ }, async (args) => {
        // Skip node_modules
        if (args.path.includes('node_modules')) {
          return null;
        }
        
        const contents = await fs.readFile(args.path, 'utf8');
        const moduleId = path.relative(process.cwd(), args.path);
        
        // Add HMR acceptance code
        const hmrCode = `
          // HMR
          if (module.hot) {
            module.hot.accept();
          }
        `;
        
        return {
          contents: contents + hmrCode,
          loader: path.extname(args.path).substring(1)
        };
      });
    }
  };
}

// Start the dev server
startDevServer().catch(err => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});
