const fs = require('fs-extra');
const path = require('path');
const { renderToString } = require('react-dom/server');
const { loadPages } = require('./pages');

/**
 * Generate static HTML for pages
 * @param {Object} options - Options for static generation
 * @param {string} options.dir - Root directory
 * @param {string} options.outDir - Output directory
 * @param {Array} options.paths - Paths to pre-render (optional)
 * @returns {Promise<void>}
 */
async function generateStaticPages({ dir, outDir, paths = [] }) {
  console.log('🔨 Generating static pages...');
  
  // Load all pages
  const pages = await loadPages(dir);
  const staticOutDir = path.join(dir, outDir, 'static');
  
  // Ensure output directory exists
  await fs.ensureDir(staticOutDir);
  
  // Generate HTML for each page
  for (const [route, pageModule] of Object.entries(pages)) {
    // Skip API routes and dynamic routes if no paths provided
    if (route.startsWith('/api/')) continue;
    
    try {
      const Page = pageModule.default;
      const getStaticProps = pageModule.getStaticProps;
      
      // Handle static props if available
      let props = {};
      if (typeof getStaticProps === 'function') {
        const staticProps = await getStaticProps();
        props = staticProps.props || {};
      }
      
      // Render page to HTML
      const html = renderToString(Page(props));
      
      // Create HTML file
      const pagePath = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
      const htmlPath = path.join(staticOutDir, pagePath);
      
      // Ensure directory exists
      await fs.ensureDir(path.dirname(htmlPath));
      
      // Write HTML file with wrapper
      await fs.writeFile(
        htmlPath,
        `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Next-Lite App</title>
            <link rel="stylesheet" href="/static/styles.css" />
          </head>
          <body>
            <div id="root">${html}</div>
            <script src="/static/client.js"></script>
          </body>
        </html>`
      );
      
      console.log(`✅ Generated: ${pagePath}`);
    } catch (error) {
      console.error(`❌ Failed to generate ${route}:`, error);
    }
  }
  
  console.log('✨ Static generation complete!');
}

module.exports = {
  generateStaticPages
};