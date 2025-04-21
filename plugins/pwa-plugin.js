/**
 * PWA Plugin for Next-Lite
 * Adds Progressive Web App support to your application
 */
const { createPlugin } = require('../scripts/plugin-system');
const fs = require('fs-extra');
const path = require('path');

// Default PWA configuration
const defaultConfig = {
  name: 'Next-Lite App',
  short_name: 'Next-Lite',
  description: 'A Next-Lite application',
  background_color: '#ffffff',
  theme_color: '#7928CA',
  display: 'standalone',
  scope: '/',
  start_url: '/',
  icons: [
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
};

/**
 * Create PWA plugin
 * @param {Object} userConfig - User configuration
 * @returns {Object} - Plugin object
 */
function createPWAPlugin(userConfig = {}) {
  // Merge user configuration with defaults
  const config = {
    ...defaultConfig,
    ...userConfig,
    icons: [
      ...(defaultConfig.icons || []),
      ...(userConfig.icons || []),
    ],
  };
  
  return createPlugin({
    name: 'pwa',
    
    // Plugin initialization
    init() {
      console.log('PWA plugin initialized');
    },
    
    // Plugin hooks
    hooks: {
      // Generate manifest.json and service worker
      beforeBuild: async (buildConfig) => {
        console.log('Generating PWA assets...');
        
        // Get output directory
        const outDir = buildConfig.outDir || 'dist';
        const publicDir = path.join(process.cwd(), 'public');
        
        // Ensure public directory exists
        await fs.ensureDir(publicDir);
        
        // Generate manifest.json
        const manifestPath = path.join(publicDir, 'manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(config, null, 2));
        console.log(`Generated manifest.json at ${manifestPath}`);
        
        // Generate service worker
        const swPath = path.join(publicDir, 'service-worker.js');
        const swContent = generateServiceWorker(config);
        await fs.writeFile(swPath, swContent);
        console.log(`Generated service-worker.js at ${swPath}`);
        
        return buildConfig;
      },
      
      // Add PWA meta tags and scripts to HTML
      afterRender: (html) => {
        // Generate meta tags and scripts
        const pwaHead = generatePWAHead(config);
        const pwaScript = generatePWAScript();
        
        // Add meta tags to head
        html = html.replace('</head>', `${pwaHead}</head>`);
        
        // Add service worker registration script to body
        html = html.replace('</body>', `${pwaScript}</body>`);
        
        return html;
      },
    },
  });
}

/**
 * Generate PWA meta tags for head
 * @param {Object} config - PWA configuration
 * @returns {string} - PWA meta tags HTML
 */
function generatePWAHead(config) {
  return `
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="${config.theme_color}" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="${config.name}" />
    <link rel="apple-touch-icon" href="${config.icons[0].src}" />
  `;
}

/**
 * Generate service worker registration script
 * @returns {string} - Service worker registration script
 */
function generatePWAScript() {
  return `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
          }).catch(function(error) {
            console.error('Service Worker registration failed:', error);
          });
        });
      }
    </script>
  `;
}

/**
 * Generate service worker content
 * @param {Object} config - PWA configuration
 * @returns {string} - Service worker content
 */
function generateServiceWorker(config) {
  const cacheName = `next-lite-${config.name.toLowerCase().replace(/\s+/g, '-')}-v1`;
  
  return `
    const CACHE_NAME = '${cacheName}';
    const urlsToCache = [
      '/',
      '/index.html',
      '/static/client.js',
      '/static/client.css',
      ${config.icons.map(icon => `'${icon.src}'`).join(',\n      ')}
    ];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.addAll(urlsToCache);
          })
      );
    });

    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            // Cache hit - return response
            if (response) {
              return response;
            }

            return fetch(event.request).then(
              (response) => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });

                return response;
              }
            );
          })
      );
    });

    self.addEventListener('activate', (event) => {
      const cacheWhitelist = ['${cacheName}'];

      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });
  `;
}

module.exports = createPWAPlugin;
