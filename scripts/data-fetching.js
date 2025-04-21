/**
 * Data fetching utilities for Next-Lite
 * Similar to Next.js's getServerSideProps and getStaticProps
 */
const fs = require('fs-extra');
const path = require('path');

/**
 * Get static props for a page
 * @param {string} pagePath - Path to the page component
 * @param {Object} context - Context object with params, locale, etc.
 * @returns {Promise<Object>} - Static props for the page
 */
async function getStaticProps(pagePath, context = {}) {
  try {
    // Import the page module
    const pageModule = require(pagePath);
    
    // Check if the page has a getStaticProps function
    if (typeof pageModule.getStaticProps !== 'function') {
      return { props: {} };
    }
    
    // Call the getStaticProps function
    const result = await pageModule.getStaticProps(context);
    
    // Handle redirect
    if (result.redirect) {
      return { redirect: result.redirect, props: {} };
    }
    
    // Handle not found
    if (result.notFound) {
      return { notFound: true, props: {} };
    }
    
    // Return the props
    return { props: result.props || {} };
  } catch (error) {
    console.error(`Error getting static props for ${pagePath}:`, error);
    return { props: {} };
  }
}

/**
 * Get static paths for a page
 * @param {string} pagePath - Path to the page component
 * @returns {Promise<Array>} - Static paths for the page
 */
async function getStaticPaths(pagePath) {
  try {
    // Import the page module
    const pageModule = require(pagePath);
    
    // Check if the page has a getStaticPaths function
    if (typeof pageModule.getStaticPaths !== 'function') {
      return { paths: [], fallback: false };
    }
    
    // Call the getStaticPaths function
    const result = await pageModule.getStaticPaths();
    
    // Return the paths
    return {
      paths: result.paths || [],
      fallback: result.fallback || false
    };
  } catch (error) {
    console.error(`Error getting static paths for ${pagePath}:`, error);
    return { paths: [], fallback: false };
  }
}

/**
 * Get server-side props for a page
 * @param {string} pagePath - Path to the page component
 * @param {Object} context - Context object with req, res, params, etc.
 * @returns {Promise<Object>} - Server-side props for the page
 */
async function getServerSideProps(pagePath, context = {}) {
  try {
    // Import the page module
    const pageModule = require(pagePath);
    
    // Check if the page has a getServerSideProps function
    if (typeof pageModule.getServerSideProps !== 'function') {
      return { props: {} };
    }
    
    // Call the getServerSideProps function
    const result = await pageModule.getServerSideProps(context);
    
    // Handle redirect
    if (result.redirect) {
      return { redirect: result.redirect, props: {} };
    }
    
    // Handle not found
    if (result.notFound) {
      return { notFound: true, props: {} };
    }
    
    // Return the props
    return { props: result.props || {} };
  } catch (error) {
    console.error(`Error getting server-side props for ${pagePath}:`, error);
    return { props: {} };
  }
}

/**
 * Check if a page has getStaticProps
 * @param {string} pagePath - Path to the page component
 * @returns {boolean} - Whether the page has getStaticProps
 */
function hasGetStaticProps(pagePath) {
  try {
    const pageModule = require(pagePath);
    return typeof pageModule.getStaticProps === 'function';
  } catch (error) {
    return false;
  }
}

/**
 * Check if a page has getStaticPaths
 * @param {string} pagePath - Path to the page component
 * @returns {boolean} - Whether the page has getStaticPaths
 */
function hasGetStaticPaths(pagePath) {
  try {
    const pageModule = require(pagePath);
    return typeof pageModule.getStaticPaths === 'function';
  } catch (error) {
    return false;
  }
}

/**
 * Check if a page has getServerSideProps
 * @param {string} pagePath - Path to the page component
 * @returns {boolean} - Whether the page has getServerSideProps
 */
function hasGetServerSideProps(pagePath) {
  try {
    const pageModule = require(pagePath);
    return typeof pageModule.getServerSideProps === 'function';
  } catch (error) {
    return false;
  }
}

module.exports = {
  getStaticProps,
  getStaticPaths,
  getServerSideProps,
  hasGetStaticProps,
  hasGetStaticPaths,
  hasGetServerSideProps,
};
