/**
 * Next-Lite Framework
 * A lightweight alternative to Next.js
 * 
 * @version 0.3.0
 * @license MIT
 */

'use strict';

// Export components
exports.Link = require('./src/components/Link');
exports.Head = require('./src/components/Head');
exports.Image = require('./src/components/Image');

// Export hooks
exports.useRouter = require('./src/hooks/useRouter');
exports.useFetch = require('./src/hooks/useFetch');
exports.useSWR = require('./src/hooks/useSWR');

// Export server utilities
exports.createApiHandler = require('./src/server/api').createApiHandler;

// Export router
exports.Router = require('./src/router');

// Export version
exports.version = '0.3.0';

// Default export
module.exports.default = exports;
