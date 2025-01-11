const esbuild = require('esbuild');
const http = require('http');
const fs = require('fs-extra');
const path = require('path');
const WebSocket = require('ws');

// Get the example name from command line args
const exampleName = process.argv[2];
if (!exampleName) {
  console.error('Please specify an example name');
  process.exit(1);
}

// Resolve paths relative to the script location
const scriptDir = __dirname;
const projectRoot = path.dirname(scriptDir);
const exampleDir = path.join(projectRoot, 'examples', exampleName);

if (!fs.existsSync(exampleDir)) {
  console.error(`Example "${exampleName}" not found at ${exampleDir}`);
  process.exit(1);
}

// Create WebSocket server for HMR
const wss = new WebSocket.Server({ port: 8080 });

let context;

// Ensure build directories exist
const nextDir = path.join(exampleDir, '.next');
const staticDir = path.join(nextDir, 'static');
if (!fs.existsSync(nextDir)) {
  fs.mkdirSync(nextDir, { recursive: true });
}
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// CSS Modules plugin
function cssModulesPlugin() {
  const cssCache = new Map();
  
  return {
    name: 'css-modules',
    setup(build) {
      // Handle .module.css files
      build.onLoad({ filter: /\.module\.css$/ }, async (args) => {
        const css = await fs.promises.readFile(args.path, 'utf8');
        const cssPath = args.path.replace(/\\/g, '/'); // Convert Windows paths to forward slashes
        
        // Use cached values if they exist
        if (cssCache.has(cssPath)) {
          const cached = cssCache.get(cssPath);
          return {
            contents: `
              const style = ${JSON.stringify(cached.cssModulesJSON)};
              const styleTag = document.createElement('style');
              styleTag.textContent = ${JSON.stringify(cached.cssContent)};
              if (!document.head.querySelector('[data-css-module="${cssPath}"]')) {
                styleTag.setAttribute('data-css-module', '${cssPath}');
                document.head.appendChild(styleTag);
              }
              export default style;
            `,
            loader: 'js',
          };
        }

        const cssModulesJSON = {};
        let cssContent = css;

        // Replace class names with unique identifiers based on file path
        cssContent = cssContent.replace(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g, (match, className) => {
          const uniqueClassName = `${className}_${Buffer.from(cssPath).toString('base64').slice(0, 8)}`;
          cssModulesJSON[className] = uniqueClassName;
          return `.${uniqueClassName}`;
        });

        // Cache the results
        cssCache.set(cssPath, { cssModulesJSON, cssContent });

        // Return the JS module with inline styles
        return {
          contents: `
            const style = ${JSON.stringify(cssModulesJSON)};
            const styleTag = document.createElement('style');
            styleTag.textContent = ${JSON.stringify(cssContent)};
            if (!document.head.querySelector('[data-css-module="${cssPath}"]')) {
              styleTag.setAttribute('data-css-module', '${cssPath}');
              document.head.appendChild(styleTag);
            }
            export default style;
          `,
          loader: 'js',
        };
      });

      // Handle regular .css files
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        if (args.path.includes('.module.css')) return;
        const css = await fs.promises.readFile(args.path, 'utf8');
        const cssPath = args.path.replace(/\\/g, '/'); // Convert Windows paths to forward slashes
        
        return {
          contents: `
            const styleTag = document.createElement('style');
            styleTag.textContent = ${JSON.stringify(css)};
            if (!document.head.querySelector('[data-css-module="${cssPath}"]')) {
              styleTag.setAttribute('data-css-module', '${cssPath}');
              document.head.appendChild(styleTag);
            }
          `,
          loader: 'js',
        };
      });
    },
  };
}

// Generate client entry point
function generateClientEntry() {
  console.log('[Build] Generating client entry...');
  const pagesDir = path.join(exampleDir, 'pages');
  const files = fs.readdirSync(pagesDir, { recursive: true });
  
  const routes = [];
  const imports = [];
  let importIndex = 0;
  
  files.forEach(file => {
    if (file.endsWith('.tsx') && !file.includes('api/')) {
      const fullPath = path.join(pagesDir, file);
      const relativePath = path.relative(pagesDir, fullPath);
      const fileName = path.basename(relativePath, '.tsx');
      const componentName = `Page${importIndex++}`;
      
      // Convert file path to route path
      let routePath = '/' + relativePath.replace(/\\/g, '/').replace('.tsx', '');
      if (routePath.endsWith('/index')) {
        routePath = routePath.replace('/index', '');
      }
      if (routePath === '') {
        routePath = '/';
      }
      
      // Handle dynamic routes
      const isDynamicRoute = routePath.includes('[') && routePath.includes(']');
      const normalizedPath = isDynamicRoute ? routePath.replace(/\[([^\]]+)\]/g, ':$1') : routePath;
      
      console.log('Adding route:', { path: normalizedPath, component: componentName, file: relativePath });
      routes.push({ path: normalizedPath, component: componentName });
      
      // Convert Windows paths to Unix paths for imports
      const unixPath = relativePath.replace(/\\/g, '/');
      imports.push(`import ${componentName} from './pages/${unixPath}';`);
    }
  });
  
  console.log('Final routes:', routes.reduce((acc, route) => {
    acc[route.path] = route.component;
    return acc;
  }, {}));
  
  console.log('Final imports:', imports);
  
  const code = `// This file is auto-generated. Do not edit it manually.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from './router';

${imports.join('\n')}

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Create React root
const root = createRoot(rootElement);

// Auto-generated routes
const routes = {
  ${routes.map(route => `'${route.path}': () => <${route.component} />`).join(',\n  ')}
};

// Render the app
root.render(
  <React.StrictMode>
    <RouterProvider routes={routes} />
  </React.StrictMode>
);`;

  const clientPath = path.join(nextDir, 'client-entry.tsx');
  fs.writeFileSync(clientPath, code);
  
  // Copy router.tsx to .next directory
  const routerSrc = path.join(exampleDir, 'router.tsx');
  const routerDest = path.join(nextDir, 'router.tsx');
  fs.copyFileSync(routerSrc, routerDest);
  
  // Create pages directory in .next and copy all pages
  const nextPagesDir = path.join(nextDir, 'pages');
  if (!fs.existsSync(nextPagesDir)) {
    fs.mkdirSync(nextPagesDir, { recursive: true });
  }
  
  fs.copySync(pagesDir, nextPagesDir);
  
  console.log('[Build] Client entry generated at:', clientPath);
  return clientPath;
}

// Watch for file changes
async function watchFiles() {
  const watcher = fs.watch(path.join(exampleDir, 'pages'), { recursive: true }, async (eventType, filename) => {
    if (filename) {
      console.log(`[HMR] File changed: ${filename}`);
      
      // Regenerate client entry if pages changed
      if (!filename.startsWith('api/')) {
        console.log('[HMR] Regenerating routes...');
        generateClientEntry();
      }

      try {
        // Rebuild the project
        if (context) {
          console.log('[HMR] Rebuilding...');
          await context.rebuild();
          console.log('[HMR] Build complete');
        }

        // Notify clients to reload
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ 
              type: 'reload',
              file: filename
            }));
          }
        });
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
    }
  });

  process.on('SIGINT', () => {
    watcher.close();
    process.exit(0);
  });
}

async function startDevServer() {
  // Create HTTP server
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log(`[Server] Received request for: ${url.pathname}`);

    // Serve static files from .next directory
    if (url.pathname.startsWith('/.next/')) {
      try {
        console.log(`[Server] Serving file from .next: ${url.pathname}`);
        const filePath = path.join(exampleDir, url.pathname);
        console.log('[Server] Full path:', filePath);
        
        if (!fs.existsSync(filePath)) {
          console.error('[Server] File not found:', filePath);
          res.writeHead(404);
          res.end('Not found');
          return;
        }

        const ext = path.extname(filePath);
        const contentType = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.jsx': 'application/javascript',
          '.ts': 'application/javascript',
          '.tsx': 'application/javascript',
          '.css': 'text/css',
        }[ext] || 'text/plain';

        const content = await fs.promises.readFile(filePath);
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content);
      } catch (error) {
        console.error('[Server] Error serving file:', error);
        res.writeHead(500);
        res.end('Internal Server Error');
      }
      return;
    }

    // For all other routes, serve index.html
    try {
      console.log('[Server] Serving index.html');
      const indexPath = path.join(exampleDir, 'index.html');
      let content = await fs.promises.readFile(indexPath, 'utf8');
      
      // Inject HMR client code
      const hmrClient = `
        <script>
          const ws = new WebSocket('ws://localhost:8080');
          let loadingOverlay;
          
          // Create loading overlay
          function createLoadingOverlay() {
            const overlay = document.createElement('div');
            overlay.style.cssText = \`
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.7);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 9999;
              opacity: 0;
              visibility: hidden;
              transition: opacity 0.2s ease, visibility 0.2s ease;
            \`;
            
            const content = document.createElement('div');
            content.style.textAlign = 'center';
            
            const spinner = document.createElement('div');
            spinner.style.cssText = \`
              width: 50px;
              height: 50px;
              border: 3px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              border-top-color: #7928CA;
              animation: spin 1s ease-in-out infinite;
              margin: 0 auto;
            \`;
            
            const message = document.createElement('div');
            message.style.cssText = \`
              color: white;
              font-size: 1.1rem;
              font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              margin-top: 1rem;
              background: linear-gradient(to right, #7928CA, #FF0080);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            \`;
            message.textContent = 'Reloading...';
            
            const style = document.createElement('style');
            style.textContent = \`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            \`;
            
            content.appendChild(spinner);
            content.appendChild(message);
            overlay.appendChild(content);
            document.head.appendChild(style);
            document.body.appendChild(overlay);
            
            return {
              show: () => {
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
              },
              hide: () => {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
              },
              setMessage: (text) => {
                message.textContent = text;
              }
            };
          }
          
          ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('[HMR] Received:', data);
            
            if (!loadingOverlay) {
              loadingOverlay = createLoadingOverlay();
            }
            
            if (data.type === 'reload') {
              console.log('[HMR] Reloading due to change in:', data.file);
              loadingOverlay.setMessage('Reloading...');
              loadingOverlay.show();
              
              // Add a small delay before reloading to show the overlay
              setTimeout(() => {
                window.location.reload();
              }, 300);
            } else if (data.type === 'error') {
              console.error('[HMR] Build error:', data.error);
              loadingOverlay.setMessage('Build Error! Check console.');
              loadingOverlay.show();
              setTimeout(() => loadingOverlay.hide(), 2000);
            }
          };
          
          ws.onopen = () => console.log('[HMR] Connected to dev server');
          ws.onclose = () => console.log('[HMR] Disconnected from dev server');
          ws.onerror = (error) => console.error('[HMR] WebSocket error:', error);
          
          // Log navigation events
          window.addEventListener('popstate', () => {
            console.log('[Router] Navigation:', window.location.pathname);
          });
          
          window.addEventListener('pushstate', () => {
            console.log('[Router] Navigation:', window.location.pathname);
          });
        </script>
      `;
      content = content.replace('</body>', `${hmrClient}</body>`);
      
      res.writeHead(200, { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    } catch (error) {
      console.error('[Server] Error serving index.html:', error);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  });

  // Generate initial client entry
  console.log('[Build] Generating client entry...');
  const clientEntry = generateClientEntry();

  // Start esbuild
  try {
    console.log('[Build] Starting esbuild...');
    context = await esbuild.context({
      entryPoints: [clientEntry],
      bundle: true,
      outfile: path.join(nextDir, 'static', 'client-entry.js'),
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
        'process.env.NODE_ENV': '"development"'
      },
      plugins: [
        cssModulesPlugin(),
      ],
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      splitting: false,
      sourcemap: true,
      minify: false,
      metafile: true,
      absWorkingDir: exampleDir,
    });

    await context.rebuild();
    console.log('[Build] Initial build complete');

    // Start watching for changes
    await watchFiles();

    // Start the server
    server.listen(3000, () => {
      console.log('\n🚀 Dev server running at:');
      console.log(`   > Local:    http://localhost:3000`);
      console.log('   > HMR:      ws://localhost:8080\n');
    });
  } catch (error) {
    console.error('[Build] Error starting esbuild:', error);
    process.exit(1);
  }
}

startDevServer();
