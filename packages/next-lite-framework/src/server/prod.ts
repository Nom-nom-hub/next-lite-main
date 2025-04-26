import path from 'path';
import fs from 'fs-extra';
import http from 'http';
import chalk from 'chalk';
import { loadConfig } from './config';
import { createApiHandler } from './api';
import { createMiddleware, bodyParser, cors } from './middleware';

// Production server options
interface ProdServerOptions {
  port?: number;
  host?: string;
}

// Start production server
export async function startProdServer(options: ProdServerOptions = {}) {
  console.log(chalk.cyan('Starting Next-Lite production server...'));
  
  // Load config
  const config = loadConfig();
  
  // Set port and host
  const port = options.port || config.server?.port || 3000;
  const host = options.host || config.server?.host || 'localhost';
  
  // Check if build exists
  const buildDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(buildDir)) {
    console.error(chalk.red('Build directory not found. Run `next-lite build` first.'));
    process.exit(1);
  }
  
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
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
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
          res.setHeader('Cache-Control', 'public, max-age=31536000');
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
      const content = await fs.readFile(indexPath, 'utf8');
      
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
  
  // Start server
  server.listen(port, host, () => {
    console.log(chalk.green(`\n🚀 Production server running at:`));
    console.log(`   > Local:    http://${host}:${port}\n`);
  });
  
  // Handle server errors
  server.on('error', (error) => {
    console.error(chalk.red('Error starting production server:'), error);
    process.exit(1);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\nShutting down production server...'));
    server.close();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log(chalk.yellow('\nShutting down production server...'));
    server.close();
    process.exit(0);
  });
}
