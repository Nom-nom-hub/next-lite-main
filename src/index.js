'use strict';

// Server exports
const { createServer } = require('./server/server');
const { renderPage, renderToString, getInitialProps } = require('./server/render');
const { optimizeImage, handleImageRequest } = require('./server/image-optimizer');

// Client exports
const { hydrate } = require('./client/hydrate');
const { Link, useRouter } = require('./client/router');

// Shared exports
const { Image } = require('./shared/image');

// Head component for managing document head
function Head({ children }) {
  // This is a placeholder component that will be implemented by the server
  return null;
}

// Create API handler
function createApiHandler(handler) {
  return handler;
}

module.exports = {
  // Server
  createServer,
  renderPage,
  renderToString,
  getInitialProps,
  optimizeImage,
  handleImageRequest,
  
  // Client
  hydrate,
  Link,
  useRouter,
  
  // Shared
  Image,
  Head,
  createApiHandler
};
