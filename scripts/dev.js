const esbuild = require('esbuild');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const cssModulesPlugin = require('./css-modules-plugin');
const APIRouter = require('./api-router');
const { generateRouterCode } = require('./route-loader');

// Create WebSocket server for HMR
const wss = new WebSocket.Server({ port: 8080 });

// Initialize API Router
const apiRouter = new APIRouter(path.join(process.cwd(), 'example', 'pages', 'api'));

let context;

// Ensure build directories exist
const nextDir = path.join(process.cwd(), '.next');
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
  const pagesDir = path.join(process.cwd(), 'example', 'pages');
  const routerCode = generateRouterCode(pagesDir);
  const clientPath = path.join(process.cwd(), '.next', 'client-entry.tsx');
  
  fs.writeFileSync(clientPath, routerCode);
  console.log('[Build] Client entry generated at:', clientPath);
  return clientPath;
}

// Watch for file changes
async function watchFiles() {
  const watcher = fs.watch('example', { recursive: true }, async (eventType, filename) => {
    if (filename) {
      console.log(`[HMR] File changed: ${filename}`);
      
      // Reload API routes if an API file changed
      if (filename.startsWith('pages/api/')) {
        console.log('[HMR] Reloading API routes...');
        Object.keys(require.cache).forEach(key => {
          if (key.includes('/pages/api/')) {
            delete require.cache[key];
          }
        });
        apiRouter.loadRoutes();
      }

      // Regenerate client entry if pages changed
      if (filename.startsWith('pages/') && !filename.startsWith('pages/api/')) {
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

    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      console.log(`[Server] Handling API request: ${url.pathname}`);
      return apiRouter.handleRequest(req, res);
    }

    // Serve static files from .next directory
    if (url.pathname.startsWith('/.next/')) {
      try {
        console.log(`[Server] Serving file from .next: ${url.pathname}`);
        const filePath = path.join(process.cwd(), url.pathname);
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
      const indexPath = path.join(process.cwd(), 'example', 'index.html');
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
    });

    await context.rebuild();
    console.log('[Build] Initial build complete');

    // Start watching for changes
    await watchFiles();

    // Start the server
    server.listen(3000, () => {
      console.log('\n🚀 Dev server running at:');
      console.log('   > Local:    http://localhost:3000');
      console.log('   > HMR:      ws://localhost:8080\n');
    });
  } catch (error) {
    console.error('[Build] Error starting esbuild:', error);
    process.exit(1);
  }
}

startDevServer();
