# Middleware in Next-Lite

Next-Lite supports middleware for processing requests before they reach your route handlers. Middleware can be used for authentication, logging, error handling, and more.

## Using Middleware

### Global Middleware

You can add global middleware to your application through the `next-lite.config.js` file:

```js
module.exports = {
  middleware: [
    // Logger middleware
    (req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.method}] ${res.statusCode} ${req.url} - ${duration}ms`);
      });
      next();
    },
    
    // Authentication middleware
    (req, res, next) => {
      const token = req.headers.authorization;
      if (token) {
        // Verify token and set user on request
        req.user = { id: '123', name: 'John Doe' };
      }
      next();
    },
  ],
};
```

### Route-Specific Middleware

You can also create route-specific middleware by adding a `_middleware.js` file in a page directory:

```
pages/
├── index.tsx
├── about.tsx
├── _middleware.js        # Applied to all routes
└── (auth)/
    ├── _middleware.js    # Applied only to routes in (auth)
    ├── profile.tsx
    └── settings.tsx
```

Example of a route-specific middleware:

```js
// pages/(auth)/_middleware.js
module.exports = (context, next) => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to login page
    window.location.href = '/login?redirect=' + encodeURIComponent(context.path);
    return;
  }
  
  // User is authenticated, continue to the route
  next();
};
```

## Middleware Context

Middleware functions receive a context object and a next function:

```js
(context, next) => {
  // Context object
  const { req, res, path, params, query } = context;
  
  // Call next to continue to the next middleware or route handler
  next();
}
```

The context object contains:

- `req`: The HTTP request object
- `res`: The HTTP response object
- `path`: The current path
- `params`: Route parameters
- `query`: Query parameters

## Middleware Execution Order

Middleware is executed in the following order:

1. Global middleware from `next-lite.config.js`
2. Route-specific middleware from parent directories
3. Route-specific middleware from the current directory

For example, for a request to `/auth/profile`:

1. Global middleware from `next-lite.config.js`
2. Middleware from `pages/_middleware.js`
3. Middleware from `pages/(auth)/_middleware.js`

## Middleware Examples

### Authentication Middleware

```js
// pages/(auth)/_middleware.js
module.exports = (context, next) => {
  console.log('Auth middleware running for path:', context.path);
  
  // In a real app, you would check if the user is authenticated
  // For this example, we'll just simulate authentication
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to login page
    window.location.href = '/login?redirect=' + encodeURIComponent(context.path);
    return;
  }
  
  // User is authenticated, continue to the route
  next();
};
```

### CORS Middleware

```js
// pages/api/_middleware.js
module.exports = (context, next) => {
  const { req, res } = context;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  // Continue to the next middleware or route handler
  next();
};
```

### Rate Limiting Middleware

```js
// pages/api/_middleware.js
const rateLimit = {};

module.exports = (context, next) => {
  const { req, res } = context;
  
  // Get client IP
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // Initialize rate limit for this IP
  if (!rateLimit[ip]) {
    rateLimit[ip] = {
      count: 0,
      resetTime: Date.now() + 60000, // Reset after 1 minute
    };
  }
  
  // Check if rate limit has been reset
  if (Date.now() > rateLimit[ip].resetTime) {
    rateLimit[ip].count = 0;
    rateLimit[ip].resetTime = Date.now() + 60000;
  }
  
  // Increment request count
  rateLimit[ip].count++;
  
  // Check if rate limit exceeded
  if (rateLimit[ip].count > 100) {
    res.statusCode = 429;
    res.end('Too Many Requests');
    return;
  }
  
  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', '100');
  res.setHeader('X-RateLimit-Remaining', 100 - rateLimit[ip].count);
  res.setHeader('X-RateLimit-Reset', Math.floor(rateLimit[ip].resetTime / 1000));
  
  // Continue to the next middleware or route handler
  next();
};
```

### Logging Middleware

```js
// pages/_middleware.js
module.exports = (context, next) => {
  const { req, res } = context;
  const start = Date.now();
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Add response listener to log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  
  // Continue to the next middleware or route handler
  next();
};
```

### Error Handling Middleware

```js
// pages/_middleware.js
module.exports = (context, next) => {
  try {
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Log error
    console.error('Middleware error:', error);
    
    // Send error response
    const { res } = context;
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};
```
