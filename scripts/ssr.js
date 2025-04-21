const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs-extra');
const path = require('path');
const esbuild = require('esbuild');
const { generateRouterCode } = require('./route-loader');
const {
  getServerSideProps,
  getStaticProps,
  hasGetServerSideProps,
  hasGetStaticProps
} = require('./data-fetching');
const config = require('./config');

/**
 * Server-side rendering function
 * @param {string} pagePath - Path to the page component
 * @param {Object} context - Context object with req, res, params, etc.
 * @returns {Promise<string>} - Rendered HTML
 */
async function renderToString(pagePath, context = {}) {
  try {
    let props = {};
    let notFound = false;
    let redirect = null;

    // Check if the page has getServerSideProps
    if (hasGetServerSideProps(pagePath)) {
      console.log(`Getting server-side props for ${pagePath}`);
      const result = await getServerSideProps(pagePath, context);
      props = result.props || {};
      notFound = result.notFound || false;
      redirect = result.redirect || null;
    }
    // Check if the page has getStaticProps
    else if (hasGetStaticProps(pagePath)) {
      console.log(`Getting static props for ${pagePath}`);
      const result = await getStaticProps(pagePath, context);
      props = result.props || {};
      notFound = result.notFound || false;
      redirect = result.redirect || null;
    }

    // Handle redirect
    if (redirect) {
      return { redirect };
    }

    // Handle not found
    if (notFound) {
      return { notFound: true };
    }

    // Dynamically import the page component
    const Component = require(pagePath).default;

    // Render the component to string
    const html = ReactDOMServer.renderToString(
      React.createElement(Component, props)
    );

    return { html, props };
  } catch (error) {
    console.error(`Error rendering ${pagePath}:`, error);
    return { html: '<!-- SSR Error -->', props: {} };
  }
}

/**
 * Renders a page with the full HTML document
 * @param {string} pagePath - Path to the page component
 * @param {Object} context - Context object with req, res, params, etc.
 * @returns {Promise<string|Object>} - Full HTML document or redirect/notFound object
 */
async function renderPage(pagePath, context = {}) {
  // Render the page to string
  const result = await renderToString(pagePath, context);

  // Handle redirect
  if (result.redirect) {
    return { redirect: result.redirect };
  }

  // Handle not found
  if (result.notFound) {
    return { notFound: true };
  }

  const { html, props } = result;

  // Read the HTML template
  const templatePath = path.join(process.cwd(), 'public', 'index.html');
  let template = await fs.readFile(templatePath, 'utf8');

  // Replace the root div with the rendered content
  template = template.replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`
  );

  // Add hydration script
  template = template.replace(
    '</body>',
    `<script>window.__INITIAL_PROPS__ = ${JSON.stringify(props)}</script>
     <script type="module" src="/.next/static/client.js"></script>
     </body>`
  );

  return template;
}

/**
 * Build a page for SSR
 * @param {string} pagesDir - Directory containing pages
 * @param {string} outputDir - Output directory for SSR builds
 */
async function buildForSSR(pagesDir, outputDir) {
  console.log('🔨 Building for SSR...');

  // Ensure output directory exists
  await fs.ensureDir(outputDir);

  // Generate router code
  const routerCode = generateRouterCode(pagesDir);
  await fs.writeFile(path.join(outputDir, 'router.js'), routerCode);

  // Build the server bundle
  await esbuild.build({
    entryPoints: [path.join(outputDir, 'router.js')],
    bundle: true,
    outfile: path.join(outputDir, 'server.js'),
    format: 'cjs',
    platform: 'node',
    target: 'node14',
    external: ['react', 'react-dom'],
    define: {
      'process.env.NODE_ENV': '"production"',
      'process.env.SSR': 'true'
    },
  });

  console.log('✅ SSR build complete');
}

/**
 * Create a context object for data fetching
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Object} params - Route parameters
 * @param {Object} query - Query parameters
 * @returns {Object} - Context object for data fetching
 */
function createDataFetchingContext(req, res, params = {}, query = {}) {
  return {
    req,
    res,
    params,
    query,
    resolvedUrl: req.url,
    locale: req.headers['accept-language']?.split(',')[0].split('-')[0] || 'en',
    locales: config.i18n.locales,
    defaultLocale: config.i18n.defaultLocale,
  };
}

module.exports = {
  renderToString,
  renderPage,
  buildForSSR,
  createDataFetchingContext
};
