'use strict';

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const path = require('path');
const fs = require('fs');

/**
 * Server-side rendering function
 * @param {Object} options - Rendering options
 * @param {string} options.pagePath - Path to the page component
 * @param {Object} options.props - Props to pass to the page component
 * @param {Object} options.req - HTTP request object
 * @param {Object} options.res - HTTP response object
 * @returns {string} - Rendered HTML
 */
async function renderToString({ pagePath, props = {}, req, res }) {
  try {
    // Import the page component
    const Page = require(pagePath).default;

    // Create the page element
    const pageElement = React.createElement(Page, props);

    // Render the page to string
    const html = ReactDOMServer.renderToString(pageElement);

    return html;
  } catch (error) {
    console.error('Error rendering page:', error);
    throw error;
  }
}

/**
 * Renders a full HTML document
 * @param {Object} options - Rendering options
 * @param {string} options.html - Rendered component HTML
 * @param {Object} options.props - Initial props
 * @param {Array} options.styles - CSS styles to include
 * @param {Array} options.scripts - JavaScript files to include
 * @param {Object} options.head - Head elements (title, meta, etc.)
 * @returns {string} - Complete HTML document
 */
function renderDocument({ html, props, styles = [], scripts = [], head = {} }) {
  const title = head.title || 'Next-Lite App';
  const meta = head.meta || [];
  const links = head.links || [];

  // Convert meta tags to HTML
  const metaTags = meta.map(metaProps => {
    const props = Object.entries(metaProps)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    return `<meta ${props}>`;
  }).join('\\n    ');

  // Convert link tags to HTML
  const linkTags = links.map(linkProps => {
    const props = Object.entries(linkProps)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    return `<link ${props}>`;
  }).join('\\n    ');

  // Convert style paths to link tags
  const styleLinks = styles.map(style => {
    return `<link rel="stylesheet" href="${style}">`;
  }).join('\\n    ');

  // Convert script paths to script tags
  const scriptTags = scripts.map(script => {
    return `<script src="${script}" defer></script>`;
  }).join('\\n    ');

  // Create the initial props script
  const initialProps = props ?
    `<script id="__NEXT_LITE_DATA__" type="application/json">${JSON.stringify(props)}</script>` :
    '';

  // Create the environment variables script
  const { getClientEnv, generateEnvScript } = require('./env');
  const envScript = `<script>${generateEnvScript(getClientEnv())}</script>`;

  // Assemble the complete HTML document
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${metaTags}
    <title>${title}</title>
    ${linkTags}
    ${styleLinks}
  </head>
  <body>
    <div id="root">${html}</div>
    ${initialProps}
    ${scriptTags}
    <script src="/_next/static/client.js" defer></script>
  </body>
</html>`;
}

/**
 * Get initial props for a page component
 * @param {Function} Component - The page component
 * @param {Object} ctx - Context object
 * @returns {Promise<Object>} - Initial props
 */
async function getInitialProps(Component, ctx) {
  if (Component.getInitialProps) {
    return await Component.getInitialProps(ctx);
  }
  return {};
}

/**
 * Server-side render a page
 * @param {Object} options - Rendering options
 * @param {string} options.pagePath - Path to the page component
 * @param {Object} options.req - HTTP request object
 * @param {Object} options.res - HTTP response object
 * @returns {string} - Complete HTML document
 */
async function renderPage({ pagePath, req, res }) {
  try {
    // Import the page component
    const Page = require(pagePath).default;

    // Create the context object
    const ctx = { req, res, query: req.query || {} };

    // Get initial props
    const props = await getInitialProps(Page, ctx);

    // Render the page to string
    const html = await renderToString({ pagePath, props, req, res });

    // Get head elements
    const head = Page.head || {};

    // Get styles and scripts
    const styles = Page.styles || [];
    const scripts = Page.scripts || [];

    // Render the complete document
    return renderDocument({ html, props, styles, scripts, head });
  } catch (error) {
    console.error('Error rendering page:', error);
    throw error;
  }
}

module.exports = {
  renderToString,
  renderDocument,
  getInitialProps,
  renderPage
};
