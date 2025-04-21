/**
 * SEO Plugin for Next-Lite
 * Adds SEO meta tags to your pages
 */
const { createPlugin } = require('../scripts/plugin-system');

// Default SEO configuration
const defaultConfig = {
  title: 'Next-Lite App',
  description: 'A Next-Lite application',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    site_name: 'Next-Lite App',
  },
  twitter: {
    handle: '@nextlite',
    site: '@nextlite',
    cardType: 'summary_large_image',
  },
};

/**
 * Create SEO plugin
 * @param {Object} userConfig - User configuration
 * @returns {Object} - Plugin object
 */
function createSEOPlugin(userConfig = {}) {
  // Merge user configuration with defaults
  const config = {
    ...defaultConfig,
    ...userConfig,
    openGraph: {
      ...defaultConfig.openGraph,
      ...(userConfig.openGraph || {}),
    },
    twitter: {
      ...defaultConfig.twitter,
      ...(userConfig.twitter || {}),
    },
  };
  
  return createPlugin({
    name: 'seo',
    
    // Plugin initialization
    init() {
      console.log('SEO plugin initialized');
    },
    
    // Plugin hooks
    hooks: {
      // Add SEO meta tags to HTML
      afterRender: (html) => {
        // Generate meta tags
        const metaTags = generateMetaTags(config);
        
        // Add meta tags to head
        return html.replace('</head>', `${metaTags}</head>`);
      },
      
      // Custom hooks
      custom: {
        // Generate meta tags for a specific page
        generatePageMeta: (pageConfig) => {
          // Merge page configuration with global configuration
          const mergedConfig = {
            ...config,
            ...pageConfig,
            openGraph: {
              ...config.openGraph,
              ...(pageConfig.openGraph || {}),
            },
            twitter: {
              ...config.twitter,
              ...(pageConfig.twitter || {}),
            },
          };
          
          return generateMetaTags(mergedConfig);
        },
      },
    },
  });
}

/**
 * Generate meta tags from configuration
 * @param {Object} config - SEO configuration
 * @returns {string} - Meta tags HTML
 */
function generateMetaTags(config) {
  const { title, description, openGraph, twitter } = config;
  
  let tags = '';
  
  // Basic meta tags
  if (title) {
    tags += `<meta property="og:title" content="${escapeHtml(title)}" />\n`;
  }
  
  if (description) {
    tags += `<meta name="description" content="${escapeHtml(description)}" />\n`;
    tags += `<meta property="og:description" content="${escapeHtml(description)}" />\n`;
  }
  
  // Open Graph meta tags
  if (openGraph) {
    if (openGraph.type) {
      tags += `<meta property="og:type" content="${escapeHtml(openGraph.type)}" />\n`;
    }
    
    if (openGraph.locale) {
      tags += `<meta property="og:locale" content="${escapeHtml(openGraph.locale)}" />\n`;
    }
    
    if (openGraph.url) {
      tags += `<meta property="og:url" content="${escapeHtml(openGraph.url)}" />\n`;
    }
    
    if (openGraph.site_name) {
      tags += `<meta property="og:site_name" content="${escapeHtml(openGraph.site_name)}" />\n`;
    }
    
    if (openGraph.images && openGraph.images.length > 0) {
      openGraph.images.forEach(image => {
        tags += `<meta property="og:image" content="${escapeHtml(image.url)}" />\n`;
        
        if (image.alt) {
          tags += `<meta property="og:image:alt" content="${escapeHtml(image.alt)}" />\n`;
        }
        
        if (image.width) {
          tags += `<meta property="og:image:width" content="${image.width}" />\n`;
        }
        
        if (image.height) {
          tags += `<meta property="og:image:height" content="${image.height}" />\n`;
        }
      });
    }
  }
  
  // Twitter meta tags
  if (twitter) {
    if (twitter.cardType) {
      tags += `<meta name="twitter:card" content="${escapeHtml(twitter.cardType)}" />\n`;
    }
    
    if (twitter.handle) {
      tags += `<meta name="twitter:creator" content="${escapeHtml(twitter.handle)}" />\n`;
    }
    
    if (twitter.site) {
      tags += `<meta name="twitter:site" content="${escapeHtml(twitter.site)}" />\n`;
    }
  }
  
  return tags;
}

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = createSEOPlugin;
