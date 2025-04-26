import path from 'path';
import fs from 'fs-extra';
import http from 'http';
import WebSocket from 'ws';
import chalk from 'chalk';
import { loadConfig } from './config';
import { build } from '../build';
import { createApiHandler } from './api';
import { createMiddleware, bodyParser, cors } from './middleware';

// Development server options
interface DevServerOptions {
  port?: number;
  host?: string;
  open?: boolean;
}

// Start development server
export async function startDevServer(options: DevServerOptions = {}) {
  console.log(chalk.cyan('Starting Next-Lite development server...'));
  
  // Load config
  const config = loadConfig();
  
  // Set port and host
  const port = options.port || config.server?.port || 3000;
  const host = options.host || config.server?.host || 'localhost';
  
  // Create WebSocket server for HMR
  const wss = new WebSocket.Server({ port: port + 1 });
  
  // Build the application
  await build({ dev: true });
  
  // Create HTTP server
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    console.log(`[Server] ${req.method} ${url.pathname}`);
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      try {
        // Find API handler
        const apiPath = url.pathname.substring(4); // Remove /api prefix
        const handlerPath = path.join(process.cwd(), 'pages', 'api', apiPath);
        
        // Check if handler exists
        if (fs.existsSync(handlerPath + '.js') || fs.existsSync(handlerPath + '.ts')) {
          // Get handler
          const handlerFile = fs.existsSync(handlerPath + '.js') ? handlerPath + '.js' : handlerPath + '.ts';
          
          // Clear require cache in development
          delete require.cache[require.resolve(handlerFile)];
          
          // Import handler
          const handler = require(handlerFile).default;
          
          // Create middleware chain
          const middleware = createMiddleware();
          
          // Add common middlewares
          middleware.use(cors({ origin: true }));
          middleware.use(bodyParser());
          
          // Create API handler
          const apiHandler = createApiHandler(handler);
          
          // Run middleware chain
          await middleware.run(req as any, res as any);
          
          // Call API handler
          await apiHandler(req, res);
        } else {
          // API route not found
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'API route not found' }));
        }
      } catch (error) {
        console.error('[API] Error handling request:', error);
        
        // Send error response
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
      
      return;
    }
    
    // Serve static files from .next directory
    if (url.pathname.startsWith('/.next/')) {
      try {
        const filePath = path.join(process.cwd(), url.pathname);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
        
        // Get file extension
        const ext = path.extname(filePath);
        
        // Set content type
        const contentType = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
          '.webp': 'image/webp'
        }[ext] || 'application/octet-stream';
        
        // Read file
        const content = await fs.readFile(filePath);
        
        // Send response
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(content);
      } catch (error) {
        console.error('[Server] Error serving static file:', error);
        
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
      
      return;
    }
    
    // Serve static files from public directory
    const publicDir = path.join(process.cwd(), 'public');
    if (fs.existsSync(publicDir)) {
      const filePath = path.join(publicDir, url.pathname);
      
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        try {
          // Get file extension
          const ext = path.extname(filePath);
          
          // Set content type
          const contentType = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.webp': 'image/webp'
          }[ext] || 'application/octet-stream';
          
          // Read file
          const content = await fs.readFile(filePath);
          
          // Send response
          res.statusCode = 200;
          res.setHeader('Content-Type', contentType);
          res.end(content);
          
          return;
        } catch (error) {
          console.error('[Server] Error serving public file:', error);
        }
      }
    }
    
    // Serve index.html for all other routes
    try {
      const indexPath = path.join(process.cwd(), '.next', 'index.html');
      let content = await fs.readFile(indexPath, 'utf8');
      
      // Inject HMR client code
      const hmrClient = `
        <script>
          const ws = new WebSocket('ws://${host}:${port + 1}');
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
      
      // Send response
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(content);
    } catch (error) {
      console.error('[Server] Error serving index.html:', error);
      
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });
  
  // Watch for file changes
  fs.watch(process.cwd(), { recursive: true }, async (eventType, filename) => {
    // Skip node_modules and .next directories
    if (
      !filename ||
      filename.includes('node_modules') ||
      filename.includes('.next')
    ) {
      return;
    }
    
    console.log(`[HMR] File changed: ${filename}`);
    
    try {
      // Rebuild the application
      await build({ dev: true });
      
      // Notify clients to reload
      wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'reload' }));
        }
      });
    } catch (error) {
      console.error('[HMR] Build failed:', error);
      
      // Notify clients of error
      wss.clients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'error', error: error instanceof Error ? error.message : String(error) }));
        }
      });
    }
  });
  
  // Start server
  server.listen(port, host, () => {
    console.log(chalk.green(`\n🚀 Development server running at:`));
    console.log(`   > Local:    http://${host}:${port}`);
    console.log(`   > HMR:      ws://${host}:${port + 1}\n`);
    
    // Open browser if requested
    if (options.open) {
      const { default: open } = require('open');
      open(`http://${host}:${port}`);
    }
  });
  
  // Handle server errors
  server.on('error', (error) => {
    console.error(chalk.red('Error starting development server:'), error);
    process.exit(1);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\nShutting down development server...'));
    server.close();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log(chalk.yellow('\nShutting down development server...'));
    server.close();
    process.exit(0);
  });
}
