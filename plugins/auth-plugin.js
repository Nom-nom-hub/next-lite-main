/**
 * Auth Plugin for Next-Lite
 * Adds authentication support to your application
 */
const { createPlugin } = require('../scripts/plugin-system');

// Default authentication configuration
const defaultConfig = {
  loginPath: '/login',
  logoutPath: '/logout',
  callbackPath: '/auth/callback',
  profilePath: '/profile',
  cookieName: 'next-lite-auth',
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  },
  providers: [],
};

/**
 * Create Auth plugin
 * @param {Object} userConfig - User configuration
 * @returns {Object} - Plugin object
 */
function createAuthPlugin(userConfig = {}) {
  // Merge user configuration with defaults
  const config = {
    ...defaultConfig,
    ...userConfig,
    cookieOptions: {
      ...defaultConfig.cookieOptions,
      ...(userConfig.cookieOptions || {}),
    },
    providers: [
      ...(defaultConfig.providers || []),
      ...(userConfig.providers || []),
    ],
  };
  
  // Authentication state
  const authState = {
    users: new Map(),
    sessions: new Map(),
  };
  
  return createPlugin({
    name: 'auth',
    
    // Plugin initialization
    init() {
      console.log('Auth plugin initialized');
    },
    
    // Plugin hooks
    hooks: {
      // Add authentication routes
      beforeServerStart: (server) => {
        // Login route
        server.get(config.loginPath, (req, res) => {
          // Render login page
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(generateLoginPage(config));
        });
        
        // Logout route
        server.get(config.logoutPath, (req, res) => {
          // Clear auth cookie
          res.setHeader('Set-Cookie', `${config.cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
          
          // Redirect to home page
          res.writeHead(302, { 'Location': '/' });
          res.end();
        });
        
        // Callback route
        server.get(config.callbackPath, (req, res) => {
          // Handle authentication callback
          const { code, state, provider } = req.query;
          
          // In a real implementation, this would verify the code with the provider
          // and create a session
          
          // For demo purposes, create a fake session
          const sessionId = Math.random().toString(36).substring(2);
          const user = {
            id: Math.random().toString(36).substring(2),
            name: 'Demo User',
            email: 'demo@example.com',
            provider,
          };
          
          // Store user and session
          authState.users.set(user.id, user);
          authState.sessions.set(sessionId, {
            userId: user.id,
            createdAt: Date.now(),
            expiresAt: Date.now() + (config.cookieOptions.maxAge * 1000),
          });
          
          // Set auth cookie
          res.setHeader('Set-Cookie', `${config.cookieName}=${sessionId}; Path=${config.cookieOptions.path}; Max-Age=${config.cookieOptions.maxAge}; ${config.cookieOptions.httpOnly ? 'HttpOnly;' : ''} ${config.cookieOptions.secure ? 'Secure;' : ''} SameSite=${config.cookieOptions.sameSite}`);
          
          // Redirect to profile page
          res.writeHead(302, { 'Location': config.profilePath });
          res.end();
        });
        
        // Profile route
        server.get(config.profilePath, (req, res) => {
          // Get session from cookie
          const cookies = parseCookies(req.headers.cookie || '');
          const sessionId = cookies[config.cookieName];
          
          if (!sessionId) {
            // No session, redirect to login
            res.writeHead(302, { 'Location': config.loginPath });
            res.end();
            return;
          }
          
          // Get session
          const session = authState.sessions.get(sessionId);
          
          if (!session || session.expiresAt < Date.now()) {
            // Invalid or expired session, redirect to login
            res.writeHead(302, { 'Location': config.loginPath });
            res.end();
            return;
          }
          
          // Get user
          const user = authState.users.get(session.userId);
          
          if (!user) {
            // User not found, redirect to login
            res.writeHead(302, { 'Location': config.loginPath });
            res.end();
            return;
          }
          
          // Render profile page
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(generateProfilePage(user));
        });
        
        return server;
      },
      
      // Add authentication middleware
      beforeRequest: (context) => {
        const { req } = context;
        
        // Skip authentication for public routes
        if (
          req.url === config.loginPath ||
          req.url === config.logoutPath ||
          req.url === config.callbackPath ||
          req.url.startsWith('/static/') ||
          req.url.startsWith('/public/')
        ) {
          return context;
        }
        
        // Get session from cookie
        const cookies = parseCookies(req.headers.cookie || '');
        const sessionId = cookies[config.cookieName];
        
        if (sessionId) {
          // Get session
          const session = authState.sessions.get(sessionId);
          
          if (session && session.expiresAt > Date.now()) {
            // Get user
            const user = authState.users.get(session.userId);
            
            if (user) {
              // Add user to request
              req.user = user;
              req.session = session;
            }
          }
        }
        
        return context;
      },
      
      // Custom hooks
      custom: {
        // Get current user
        getCurrentUser: (req) => {
          return req.user || null;
        },
        
        // Check if user is authenticated
        isAuthenticated: (req) => {
          return !!req.user;
        },
        
        // Create a new user
        createUser: (userData) => {
          const userId = Math.random().toString(36).substring(2);
          const user = {
            id: userId,
            ...userData,
          };
          
          authState.users.set(userId, user);
          
          return user;
        },
        
        // Create a new session
        createSession: (userId) => {
          const sessionId = Math.random().toString(36).substring(2);
          const session = {
            userId,
            createdAt: Date.now(),
            expiresAt: Date.now() + (config.cookieOptions.maxAge * 1000),
          };
          
          authState.sessions.set(sessionId, session);
          
          return {
            sessionId,
            session,
          };
        },
      },
    },
  });
}

/**
 * Parse cookies from cookie header
 * @param {string} cookieHeader - Cookie header
 * @returns {Object} - Parsed cookies
 */
function parseCookies(cookieHeader) {
  const cookies = {};
  
  if (!cookieHeader) {
    return cookies;
  }
  
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts[0].trim();
    const value = parts[1] || '';
    cookies[name] = value.trim();
  });
  
  return cookies;
}

/**
 * Generate login page HTML
 * @param {Object} config - Auth configuration
 * @returns {string} - Login page HTML
 */
function generateLoginPage(config) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login - Next-Lite</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f5f5;
        }
        
        .container {
          max-width: 400px;
          width: 100%;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          text-align: center;
          color: #333;
        }
        
        .provider-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .provider-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          border: 1px solid #ddd;
          background-color: white;
          color: #333;
          font-size: 1rem;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        
        .provider-button:hover {
          background-color: #f5f5f5;
        }
        
        .provider-icon {
          margin-right: 0.5rem;
          font-size: 1.2rem;
        }
        
        .back-link {
          display: block;
          margin-top: 1.5rem;
          text-align: center;
          color: #666;
          text-decoration: none;
        }
        
        .back-link:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Login</h1>
        
        <div class="provider-list">
          <a href="${config.callbackPath}?provider=google" class="provider-button">
            <span class="provider-icon">G</span>
            Continue with Google
          </a>
          
          <a href="${config.callbackPath}?provider=github" class="provider-button">
            <span class="provider-icon">GH</span>
            Continue with GitHub
          </a>
          
          <a href="${config.callbackPath}?provider=facebook" class="provider-button">
            <span class="provider-icon">F</span>
            Continue with Facebook
          </a>
        </div>
        
        <a href="/" class="back-link">Back to Home</a>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate profile page HTML
 * @param {Object} user - User object
 * @returns {string} - Profile page HTML
 */
function generateProfilePage(user) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Profile - Next-Lite</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f5f5;
        }
        
        .container {
          max-width: 600px;
          width: 100%;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          text-align: center;
          color: #333;
        }
        
        .profile {
          margin-bottom: 2rem;
        }
        
        .profile-item {
          display: flex;
          margin-bottom: 1rem;
        }
        
        .profile-label {
          width: 100px;
          font-weight: 500;
          color: #666;
        }
        
        .profile-value {
          flex: 1;
        }
        
        .button-group {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .button {
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          border: none;
          background-color: #7928CA;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        
        .button:hover {
          background-color: #6a23b5;
        }
        
        .button.secondary {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
        }
        
        .button.secondary:hover {
          background-color: #eaeaea;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Profile</h1>
        
        <div class="profile">
          <div class="profile-item">
            <div class="profile-label">Name</div>
            <div class="profile-value">${user.name}</div>
          </div>
          
          <div class="profile-item">
            <div class="profile-label">Email</div>
            <div class="profile-value">${user.email}</div>
          </div>
          
          <div class="profile-item">
            <div class="profile-label">Provider</div>
            <div class="profile-value">${user.provider}</div>
          </div>
        </div>
        
        <div class="button-group">
          <a href="/" class="button secondary">Home</a>
          <a href="/logout" class="button">Logout</a>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = createAuthPlugin;
