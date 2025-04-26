'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { generateStaticPage } = require('./static-generation');

// Promisify fs functions
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Cache for revalidation timestamps
const revalidationCache = new Map();

/**
 * Check if a page needs to be revalidated
 * @param {Object} options - Options for revalidation check
 * @param {string} options.outputPath - Path to the HTML file
 * @param {number} options.revalidate - Revalidation time in seconds
 * @returns {Promise<boolean>} - Whether the page needs to be revalidated
 */
async function shouldRevalidate({ outputPath, revalidate }) {
  try {
    // If revalidate is not set, don't revalidate
    if (!revalidate || revalidate <= 0) {
      return false;
    }
    
    // Check if the file exists
    try {
      const stats = await stat(outputPath);
      
      // Check if the file is older than the revalidation time
      const lastModified = stats.mtime.getTime();
      const now = Date.now();
      
      // Get the last revalidation time from the cache
      const lastRevalidation = revalidationCache.get(outputPath) || lastModified;
      
      // Check if enough time has passed since the last revalidation
      return (now - lastRevalidation) > (revalidate * 1000);
    } catch (error) {
      // If the file doesn't exist, it needs to be generated
      return true;
    }
  } catch (error) {
    console.error(`Error checking if page needs to be revalidated: ${outputPath}`, error);
    return false;
  }
}

/**
 * Serve a static page with incremental regeneration
 * @param {Object} options - Options for serving the page
 * @param {string} options.outputPath - Path to the HTML file
 * @param {string} options.pagePath - Path to the page component
 * @param {Object} options.params - Dynamic parameters
 * @param {number} options.revalidate - Revalidation time in seconds
 * @param {Object} options.req - HTTP request object
 * @param {Object} options.res - HTTP response object
 * @returns {Promise<string>} - HTML content
 */
async function serveWithRevalidation({ outputPath, pagePath, params, revalidate, req, res }) {
  try {
    let html;
    
    // Try to read the static HTML file
    try {
      html = await readFile(outputPath, 'utf8');
      
      // Check if the page needs to be revalidated
      const needsRevalidation = await shouldRevalidate({ outputPath, revalidate });
      
      if (needsRevalidation) {
        // Revalidate the page in the background
        revalidateInBackground({ outputPath, pagePath, params, revalidate });
      }
    } catch (error) {
      // If the file doesn't exist, generate it
      const page = require(pagePath).default;
      
      // Get the props for this path
      const { props } = await page.getStaticProps({ params });
      
      // Generate the static page
      await generateStaticPage({
        pagePath,
        outputPath,
        props
      });
      
      // Read the generated HTML
      html = await readFile(outputPath, 'utf8');
      
      // Update the revalidation cache
      revalidationCache.set(outputPath, Date.now());
    }
    
    return html;
  } catch (error) {
    console.error(`Error serving page with revalidation: ${outputPath}`, error);
    throw error;
  }
}

/**
 * Revalidate a page in the background
 * @param {Object} options - Options for revalidation
 * @param {string} options.outputPath - Path to the HTML file
 * @param {string} options.pagePath - Path to the page component
 * @param {Object} options.params - Dynamic parameters
 * @param {number} options.revalidate - Revalidation time in seconds
 */
async function revalidateInBackground({ outputPath, pagePath, params, revalidate }) {
  try {
    // Update the revalidation cache
    revalidationCache.set(outputPath, Date.now());
    
    // Load the page component
    const page = require(pagePath).default;
    
    // Get the props for this path
    const { props } = await page.getStaticProps({ params });
    
    // Generate the static page
    await generateStaticPage({
      pagePath,
      outputPath,
      props
    });
    
    console.log(`Revalidated page: ${outputPath}`);
  } catch (error) {
    console.error(`Error revalidating page in background: ${outputPath}`, error);
  }
}

/**
 * Create a revalidation handler for a page
 * @param {Object} options - Options for the handler
 * @param {string} options.pagePath - Path to the page component
 * @param {string} options.outputDir - Directory to write HTML files
 * @returns {Function} - Revalidation handler
 */
function createRevalidationHandler({ pagePath, outputDir }) {
  return async (req, res) => {
    try {
      const page = require(pagePath).default;
      
      // Check if the page has getStaticProps and getStaticPaths
      if (!page.getStaticProps || !page.getStaticPaths) {
        res.statusCode = 404;
        res.end('Not Found');
        return;
      }
      
      // Get the paths for this page
      const { paths } = await page.getStaticPaths();
      
      // Revalidate each path
      for (const pathData of paths) {
        const { params } = pathData;
        
        // Get the output path for this path
        const outputPath = path.join(outputDir, ...Object.values(params), 'index.html');
        
        // Revalidate the page
        await revalidateInBackground({
          outputPath,
          pagePath,
          params,
          revalidate: 1 // Force revalidation
        });
      }
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ revalidated: true }));
    } catch (error) {
      console.error(`Error handling revalidation request: ${pagePath}`, error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  };
}

module.exports = {
  shouldRevalidate,
  serveWithRevalidation,
  revalidateInBackground,
  createRevalidationHandler
};
