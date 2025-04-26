const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const esbuild = require('esbuild');

// Create WebSocket server for HMR
const wss = new WebSocket.Server({ port: 8083 });

// Ensure build directories exist
const nextDir = path.join(__dirname, '.next');
const staticDir = path.join(nextDir, 'static');
if (!fs.existsSync(nextDir)) {
  fs.mkdirSync(nextDir, { recursive: true });
}
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// API handlers
const apiHandlers = {
  '/api/posts': require('../pages/api/posts'),
  '/api/users': require('../pages/api/users'),
  '/api/products': require('../pages/api/products')
};

// Start esbuild
async function startBuild() {
  try {
    console.log('[Build] Starting esbuild...');
    context = await esbuild.context({
      entryPoints: [path.join(__dirname, 'app.js')],
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
        '.js': 'jsx', // Treat all JS files as JSX
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
    return context;
  } catch (error) {
    console.error('[Build] Error starting esbuild:', error);
    process.exit(1);
  }
}

// Watch for file changes
async function watchFiles(context) {
  const watcher = fs.watch(__dirname, { recursive: true }, async (eventType, filename) => {
    // Skip node_modules and .next directories
    if (filename.includes('node_modules') || filename.includes('.next')) {
      return;
    }

    console.log(`[HMR] File changed: ${filename}`);

    try {
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
  });

  process.on('SIGINT', () => {
    watcher.close();
    process.exit(0);
  });
}

// Handle API requests
function handleApiRequest(req, res, url) {
  const handler = apiHandlers[url.pathname];

  if (!handler) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
    return;
  }

  // Parse query parameters
  const query = {};
  for (const [key, value] of url.searchParams.entries()) {
    query[key] = value;
  }

  // Parse request body for POST requests
  if (req.method === 'POST' || req.method === 'PUT') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsedBody = body ? JSON.parse(body) : {};

        // Call the API handler
        handler({
          method: req.method,
          query,
          body: parsedBody,
          headers: req.headers
        }, {
          status: (code) => {
            res.statusCode = code;
            return {
              json: (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              }
            };
          },
          json: (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          },
          writeHead: (code, headers) => {
            res.writeHead(code, headers);
            return res;
          },
          end: (data) => {
            res.end(data);
          }
        });
      } catch (error) {
        console.error('[API] Error parsing request body:', error);
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  } else {
    // Call the API handler for GET, DELETE, etc.
    handler({
      method: req.method,
      query,
      headers: req.headers
    }, {
      status: (code) => {
        res.statusCode = code;
        return {
          json: (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          }
        };
      },
      json: (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      },
      writeHead: (code, headers) => {
        res.writeHead(code, headers);
        return res;
      },
      end: (data) => {
        res.end(data);
      }
    });
  }
}

// Start the development server
async function startDevServer() {
  // Build the project
  const context = await startBuild();

  // Watch for file changes
  await watchFiles(context);

  // Create HTTP server
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log(`[Server] Received request for: ${url.pathname}`);

    // Handle API requests
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(req, res, url);
    }

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

    // For all other routes, serve index.html
    try {
      console.log('[Server] Serving index.html');
      const indexPath = path.join(__dirname, 'index.html');
      console.log('[Server] Index path:', indexPath);
      let content = await fs.promises.readFile(indexPath, 'utf8');

      // Inject HMR client code
      const hmrClient = `
        <script>
          const ws = new WebSocket('ws://localhost:8083');
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

            content.appendChild(spinner);
            content.appendChild(message);
            overlay.appendChild(content);
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

  // Start the server
  server.listen(3002, () => {
    console.log('\n🚀 Advanced Dev server running at:');
    console.log('   > Local:    http://localhost:3002');
    console.log('   > HMR:      ws://localhost:8083\n');
  });
}

// Start the development server
let context;
startDevServer();
