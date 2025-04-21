/**
 * Analytics Plugin for Next-Lite
 * Tracks page views and performance metrics
 */
const { createPlugin } = require('../../../scripts/plugin-system');

// Simple in-memory storage for analytics data
const analytics = {
  pageViews: {},
  performance: [],
};

// Create the analytics plugin
const analyticsPlugin = createPlugin({
  name: 'analytics',
  
  // Plugin initialization
  init() {
    console.log('Analytics plugin initialized');
  },
  
  // Plugin hooks
  hooks: {
    // Track page views
    afterRequest: (context) => {
      const { req, res } = context;
      const path = req.url;
      
      // Increment page view count
      if (!analytics.pageViews[path]) {
        analytics.pageViews[path] = 0;
      }
      analytics.pageViews[path]++;
      
      // Log page view
      console.log(`[Analytics] Page view: ${path} (${analytics.pageViews[path]} views)`);
      
      return context;
    },
    
    // Track performance
    afterRoute: (context) => {
      const { req, res, startTime } = context;
      const path = req.url;
      const duration = Date.now() - startTime;
      
      // Record performance data
      analytics.performance.push({
        path,
        duration,
        timestamp: new Date().toISOString(),
      });
      
      // Log performance
      console.log(`[Analytics] Route performance: ${path} (${duration}ms)`);
      
      return context;
    },
    
    // Add custom API endpoint for analytics data
    beforeServerStart: (server) => {
      // Add route for analytics data
      server.get('/api/analytics', (req, res) => {
        res.json({
          pageViews: analytics.pageViews,
          performance: analytics.performance.slice(-100), // Return last 100 entries
        });
      });
      
      return server;
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
    
    // Custom hooks
    custom: {
      // Custom hook for tracking events
      trackEvent: (event) => {
        console.log(`[Analytics] Event: ${event.name}`, event.data);
        return event;
      },
    },
  },
});

module.exports = analyticsPlugin;
