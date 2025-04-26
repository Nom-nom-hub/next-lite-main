const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const esbuild = require('esbuild');

// Create WebSocket server for HMR
const wss = new WebSocket.Server({ port: 8082 });

// Ensure build directories exist
const nextDir = path.join(__dirname, '.next');
const staticDir = path.join(nextDir, 'static');
if (!fs.existsSync(nextDir)) {
  fs.mkdirSync(nextDir, { recursive: true });
}
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// Generate client entry point
function generateClientEntry() {
  console.log('[Build] Generating client entry...');

  // Scan pages directory
  const pagesDir = path.join(__dirname, 'pages');
  const entries = fs.readdirSync(pagesDir);

  // Filter out API routes and non-page files
  const pageFiles = entries.filter(file => {
    if (file === 'api' || file.startsWith('_') || !file.endsWith('.tsx')) {
      return false;
    }
    return true;
  });

  // Generate routes
  const routes = {};
  const imports = [];

  pageFiles.forEach(file => {
    const name = file.replace('.tsx', '');
    const componentName = name === 'index' ? 'HomePage' : `${name.charAt(0).toUpperCase() + name.slice(1)}Page`;
    const route = name === 'index' ? '/' : `/${name}`;

    routes[route] = componentName;
    // Use absolute path for imports
    imports.push(`import ${componentName} from '${path.join(__dirname, 'pages', name)}';`);
  });

  // Generate client entry code
  const code = `// This file is auto-generated. Do not edit it manually.
import React from 'react';
import { createRoot } from 'react-dom/client';

${imports.join('\n')}

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Create React root
const root = createRoot(rootElement);

// Simple router
const Router = () => {
  const [path, setPath] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    // Handle link clicks
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('/')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        window.history.pushState({}, '', href);
        setPath(href);
      }
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Render the component for the current path
  const Component = (() => {
    if (routes[path]) {
      return routes[path];
    }
    return routes['/'] || (() => <div>Page not found</div>);
  })();

  return <Component />;
};

// Render the app
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
`;

  const clientPath = path.join(__dirname, '.next', 'client-entry.jsx');
  fs.writeFileSync(clientPath, code);
  console.log('[Build] Client entry generated at:', clientPath);
  return clientPath;
}

// Watch for file changes
async function watchFiles() {
  const watcher = fs.watch('pages', { recursive: true }, async (eventType, filename) => {
    if (filename) {
      console.log(`[HMR] File changed: ${filename}`);

      try {
        // Regenerate client entry
        console.log('[HMR] Regenerating routes...');
        generateClientEntry();

        // Rebuild the project
        console.log('[HMR] Rebuilding...');
        await context.rebuild();
        console.log('[HMR] Build complete');

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
        const filePath = path.join(__dirname, url.pathname);
        console.log('[Server] Full path:', filePath);

        // Check if file exists
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

    // Serve static files from styles directory
    if (url.pathname.startsWith('/styles/')) {
      try {
        console.log(`[Server] Serving file from styles: ${url.pathname}`);
        const filePath = path.join(__dirname, url.pathname);
        console.log('[Server] Full path:', filePath);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
          console.error('[Server] File not found:', filePath);
          res.writeHead(404);
          res.end('Not found');
          return;
        }

        const ext = path.extname(filePath);
        const contentType = {
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
      const indexPath = path.join(__dirname, 'index.html');
      console.log('[Server] Index path:', indexPath);
      let content = await fs.promises.readFile(indexPath, 'utf8');

      // Inject HMR client code
      const hmrClient = `
        <script>
          const ws = new WebSocket('ws://localhost:8082');
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
      outfile: path.join(__dirname, '.next', 'static', 'client.js'),
      format: 'esm',
      platform: 'browser',
      target: 'es2015',
      jsx: 'automatic',
      jsxImportSource: 'react',
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.jsx': 'jsx',
        '.js': 'js',
        '.css': 'css'
      },
      define: {
        'process.env.NODE_ENV': '"development"'
      },
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      splitting: false,
      sourcemap: true,
      minify: false,
      metafile: true,
    });

    await context.rebuild();
    console.log('[Build] Initial build complete');

    // Start watching for changes
    await watchFiles();

    // Start the server
    server.listen(3001, () => {
      console.log('\n🚀 Dev server running at:');
      console.log('   > Local:    http://localhost:3001');
      console.log('   > HMR:      ws://localhost:8082\n');
    });
  } catch (error) {
    console.error('[Build] Error starting esbuild:', error);
    process.exit(1);
  }
}

let context;
startDevServer();
