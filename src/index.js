'use strict';

// Server exports
const { createServer } = require('./server/server');
const { renderPage, renderToString, getInitialProps } = require('./server/render');
const { optimizeImage, handleImageRequest } = require('./server/image-optimizer');
const { generateStaticPage, generateStaticSite } = require('./server/static-generation');
const { serveWithRevalidation, createRevalidationHandler } = require('./server/incremental-regeneration');
const { createMiddlewareAPI } = require('./server/middleware');

// Client exports
const { hydrate } = require('./client/hydrate');
const { Link, useRouter } = require('./client/router');

// Shared exports
const { Image } = require('./shared/image');
const { Script } = require('./shared/script');
const { Font } = require('./shared/font');
const { I18nProvider, useI18n, getLocalizedPath } = require('./shared/i18n');

// Head component for managing document head
function Head({ children }) {
  // This is a placeholder component that will be implemented by the server
  return null;
}

// Create API handler
function createApiHandler(handler) {
  return handler;
}

// Create middleware
const middleware = createMiddlewareAPI();

module.exports = {
  // Server
  createServer,
  renderPage,
  renderToString,
  getInitialProps,
  optimizeImage,
  handleImageRequest,
  generateStaticPage,
  generateStaticSite,
  serveWithRevalidation,
  createRevalidationHandler,

  // Client
  hydrate,
  Link,
  useRouter,

  // Shared
  Image,
  Script,
  Font,
  Head,
  createApiHandler,
  middleware,
  I18nProvider,
  useI18n,
  getLocalizedPath
};
