# Plugins in Next-Lite

Next-Lite includes a powerful plugin system that allows you to extend the framework's functionality. Plugins can hook into various parts of the build process, server, and rendering pipeline.

## Using Plugins

### Configuration File

You can add plugins to your application through the `next-lite.config.js` file:

```js
module.exports = {
  plugins: [
    // Inline plugin
    {
      name: 'my-plugin',
      hooks: {
        beforeBuild: (config) => {
          console.log('Before build');
          return config;
        },
        afterBuild: (result) => {
          console.log('After build');
          return result;
        },
      },
    },
    
    // External plugin
    require('next-lite-plugin-analytics'),
  ],
};
```

### Plugins Directory

You can also create a `plugins` directory in your project and add plugin files there:

```
my-app/
├── plugins/
│   ├── analytics.js
│   └── theme.js
└── next-lite.config.js
```

Next-Lite will automatically load and register these plugins.

## Creating Plugins

### Basic Plugin Structure

A plugin is an object with a `name` property and optional `hooks` and `init` properties:

```js
// plugins/my-plugin.js
const { createPlugin } = require('next-lite/plugin-system');

const myPlugin = createPlugin({
  // Plugin name (required)
  name: 'my-plugin',
  
  // Plugin initialization (optional)
  init() {
    console.log('My plugin initialized');
  },
  
  // Plugin hooks (optional)
  hooks: {
    // Hook implementations
  },
});

module.exports = myPlugin;
```

### Available Hooks

Next-Lite provides several hooks that plugins can use:

#### Build Hooks

- `beforeBuild`: Called before the build process starts
- `afterBuild`: Called after the build process completes

```js
hooks: {
  beforeBuild: (config) => {
    // Modify build configuration
    config.minify = false;
    return config;
  },
  
  afterBuild: (result) => {
    console.log('Build completed');
    return result;
  },
}
```

#### Server Hooks

- `beforeServerStart`: Called before the server starts
- `afterServerStart`: Called after the server starts

```js
hooks: {
  beforeServerStart: (server) => {
    // Add custom routes
    server.get('/custom-route', (req, res) => {
      res.send('Custom route');
    });
    
    return server;
  },
  
  afterServerStart: (server) => {
    console.log('Server started');
    return server;
  },
}
```

#### Request Hooks

- `beforeRequest`: Called before processing a request
- `afterRequest`: Called after processing a request

```js
hooks: {
  beforeRequest: (context) => {
    // Add data to the request context
    context.startTime = Date.now();
    return context;
  },
  
  afterRequest: (context) => {
    // Log request duration
    const duration = Date.now() - context.startTime;
    console.log(`Request to ${context.req.url} took ${duration}ms`);
    return context;
  },
}
```

#### Route Hooks

- `beforeRoute`: Called before routing a request
- `afterRoute`: Called after routing a request

```js
hooks: {
  beforeRoute: (context) => {
    // Modify route parameters
    context.params.id = context.params.id.toLowerCase();
    return context;
  },
  
  afterRoute: (context) => {
    // Log route information
    console.log(`Routed to ${context.route}`);
    return context;
  },
}
```

#### Render Hooks

- `beforeRender`: Called before rendering a page
- `afterRender`: Called after rendering a page

```js
hooks: {
  beforeRender: (context) => {
    // Add data to the render context
    context.props.customData = 'Custom data';
    return context;
  },
  
  afterRender: (html) => {
    // Modify the rendered HTML
    return html.replace('</body>', '<script>console.log("Hello from plugin")</script></body>');
  },
}
```

#### Custom Hooks

You can also define custom hooks for your plugins:

```js
hooks: {
  custom: {
    // Custom hook
    trackEvent: (event) => {
      console.log(`Event: ${event.name}`, event.data);
      return event;
    },
  },
}
```

### Using Custom Hooks

You can use custom hooks from other plugins:

```js
const { applyHooks } = require('next-lite/plugin-system');

// Apply a custom hook
const result = await applyHooks('custom.trackEvent', {
  name: 'button_click',
  data: { button: 'submit' },
});
```

## Example Plugins

### Analytics Plugin

```js
// plugins/analytics.js
const { createPlugin } = require('next-lite/plugin-system');

// Simple in-memory storage for analytics data
const analytics = {
  pageViews: {},
  performance: [],
};

// Create the analytics plugin
const analyticsPlugin = createPlugin({
  name: 'analytics',
  
  init() {
    console.log('Analytics plugin initialized');
  },
  
  hooks: {
    // Track page views
    afterRequest: (context) => {
      const { req } = context;
      const path = req.url;
      
      // Increment page view count
      if (!analytics.pageViews[path]) {
        analytics.pageViews[path] = 0;
      }
      analytics.pageViews[path]++;
      
      return context;
    },
    
    // Track performance
    afterRoute: (context) => {
      const { req, startTime } = context;
      const path = req.url;
      const duration = Date.now() - startTime;
      
      // Record performance data
      analytics.performance.push({
        path,
        duration,
        timestamp: new Date().toISOString(),
      });
      
      return context;
    },
    
    // Add analytics script to HTML
    afterRender: (html) => {
      // Add analytics script before closing body tag
      return html.replace(
        '</body>',
        `<script>
          // Simple analytics script
          (function() {
            const sendPageView = () => {
              const path = window.location.pathname;
              fetch('/api/analytics/pageview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path })
              });
            };
            
            // Send page view on load
            sendPageView();
            
            // Send page view on navigation
            window.addEventListener('pushstate', sendPageView);
          })();
        </script>
        </body>`
      );
    },
  },
});

module.exports = analyticsPlugin;
```

### Theme Plugin

```js
// plugins/theme.js
const { createPlugin } = require('next-lite/plugin-system');

// Create the theme plugin
const themePlugin = createPlugin({
  name: 'theme',
  
  init() {
    console.log('Theme plugin initialized');
  },
  
  hooks: {
    // Add theme styles and script to HTML
    afterRender: (html) => {
      // Add theme styles to head
      const headStyles = `
        <style id="theme-styles">
          :root {
            --bg-color: #ffffff;
            --text-color: #333333;
            --primary-color: #7928CA;
          }
          
          [data-theme="dark"] {
            --bg-color: #1a1a1a;
            --text-color: #f5f5f5;
            --primary-color: #9d4edd;
          }
          
          body {
            background-color: var(--bg-color);
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
          }
        </style>
      `;
      
      // Add theme toggle button and script to body
      const bodyScript = `
        <button id="theme-toggle" aria-label="Toggle theme">
          🌓
        </button>
        
        <script>
          // Theme toggle functionality
          (function() {
            const themeToggle = document.getElementById('theme-toggle');
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Check for saved theme preference or use OS preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
            
            // Toggle theme
            themeToggle.addEventListener('click', () => {
              const currentTheme = document.documentElement.getAttribute('data-theme');
              const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
              
              document.documentElement.setAttribute('data-theme', newTheme);
              localStorage.setItem('theme', newTheme);
            });
          })();
        </script>
      `;
      
      // Insert styles in head
      html = html.replace('</head>', `${headStyles}</head>`);
      
      // Insert toggle button and script before closing body tag
      html = html.replace('</body>', `${bodyScript}</body>`);
      
      return html;
    },
  },
});

module.exports = themePlugin;
```
