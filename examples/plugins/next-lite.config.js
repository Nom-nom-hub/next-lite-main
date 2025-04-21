/**
 * Next-Lite configuration file
 */
module.exports = {
  // Server configuration
  server: {
    port: 3000,
    host: 'localhost',
  },
  
  // Build configuration
  build: {
    target: 'es2015',
    minify: true,
    sourcemap: true,
    outDir: 'dist',
  },
  
  // Rendering options
  rendering: {
    ssr: false,
    staticExport: false,
  },
  
  // Environment variables
  env: {
    APP_NAME: 'Plugin Example',
  },
  
  // Plugins
  plugins: [
    // SEO Plugin
    {
      name: 'seo',
      hooks: {
        afterRender: (html) => {
          // Add meta tags for SEO
          const metaTags = `
            <meta name="description" content="Next-Lite Plugin System Example">
            <meta name="keywords" content="next-lite, plugins, javascript, react">
            <meta property="og:title" content="Next-Lite Plugins">
            <meta property="og:description" content="Example of the Next-Lite plugin system">
            <meta property="og:type" content="website">
            <meta name="twitter:card" content="summary_large_image">
          `;
          
          return html.replace('</head>', `${metaTags}</head>`);
        },
      },
    },
  ],
};
