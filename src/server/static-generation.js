'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { renderPage } = require('./render');

// Promisify fs functions
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

/**
 * Generate static HTML for a page
 * @param {Object} options - Options for static generation
 * @param {string} options.pagePath - Path to the page component
 * @param {string} options.outputPath - Path to write the HTML file
 * @param {Object} options.props - Props to pass to the page component
 * @returns {Promise<string>} - Path to the generated HTML file
 */
async function generateStaticPage({ pagePath, outputPath, props = {} }) {
  try {
    // Create a mock request and response
    const req = { query: {} };
    const res = { statusCode: 200 };
    
    // Render the page to HTML
    const html = await renderPage({ pagePath, req, res, props });
    
    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    await mkdir(outputDir, { recursive: true });
    
    // Write the HTML to the output file
    await writeFile(outputPath, html);
    
    return outputPath;
  } catch (error) {
    console.error(`Error generating static page for ${pagePath}:`, error);
    throw error;
  }
}

/**
 * Generate static HTML for all pages in a directory
 * @param {Object} options - Options for static generation
 * @param {string} options.pagesDir - Directory containing page components
 * @param {string} options.outputDir - Directory to write HTML files
 * @param {Object} options.staticPaths - Map of page paths to static paths
 * @returns {Promise<Array<string>>} - Paths to the generated HTML files
 */
async function generateStaticSite({ pagesDir, outputDir, staticPaths = {} }) {
  try {
    // Create the output directory if it doesn't exist
    await mkdir(outputDir, { recursive: true });
    
    // Get all page files
    const pageFiles = await getPageFiles(pagesDir);
    
    // Generate static HTML for each page
    const generatedFiles = [];
    
    for (const pageFile of pageFiles) {
      // Skip API routes
      if (pageFile.startsWith('api/')) {
        continue;
      }
      
      // Get the page path
      const pagePath = path.join(pagesDir, pageFile);
      
      // Get the output path
      const outputPath = getOutputPath(pageFile, outputDir);
      
      // Check if the page has getStaticProps
      const page = require(pagePath);
      
      if (page.default && page.default.getStaticProps) {
        // If the page has getStaticPaths, generate a page for each path
        if (page.default.getStaticPaths) {
          const { paths } = await page.default.getStaticPaths();
          
          for (const pathData of paths) {
            const { params } = pathData;
            
            // Get the props for this path
            const { props } = await page.default.getStaticProps({ params });
            
            // Generate the output path for this path
            const dynamicOutputPath = getDynamicOutputPath(pageFile, params, outputDir);
            
            // Generate the static page
            const generatedFile = await generateStaticPage({
              pagePath,
              outputPath: dynamicOutputPath,
              props
            });
            
            generatedFiles.push(generatedFile);
          }
        } else {
          // If the page doesn't have getStaticPaths, just generate one page
          const { props } = await page.default.getStaticProps({});
          
          // Generate the static page
          const generatedFile = await generateStaticPage({
            pagePath,
            outputPath,
            props
          });
          
          generatedFiles.push(generatedFile);
        }
      } else {
        // If the page doesn't have getStaticProps, just generate one page with no props
        const generatedFile = await generateStaticPage({
          pagePath,
          outputPath
        });
        
        generatedFiles.push(generatedFile);
      }
    }
    
    return generatedFiles;
  } catch (error) {
    console.error('Error generating static site:', error);
    throw error;
  }
}

/**
 * Get all page files in a directory
 * @param {string} dir - Directory to search
 * @param {string} prefix - Prefix for recursive calls
 * @returns {Promise<Array<string>>} - Paths to page files
 */
async function getPageFiles(dir, prefix = '') {
  const entries = await readdir(dir);
  
  const files = [];
  
  for (const entry of entries) {
    const entryPath = path.join(dir, entry);
    const entryStats = await stat(entryPath);
    
    if (entryStats.isDirectory()) {
      // Recursively get files in subdirectories
      const subFiles = await getPageFiles(entryPath, path.join(prefix, entry));
      files.push(...subFiles);
    } else if (entry.endsWith('.js') || entry.endsWith('.jsx') || entry.endsWith('.ts') || entry.endsWith('.tsx')) {
      // Add page files
      files.push(path.join(prefix, entry));
    }
  }
  
  return files;
}

/**
 * Get the output path for a page file
 * @param {string} pageFile - Path to the page file
 * @param {string} outputDir - Directory to write HTML files
 * @returns {string} - Path to the output HTML file
 */
function getOutputPath(pageFile, outputDir) {
  // Remove the file extension
  const pagePathWithoutExt = pageFile.replace(/\.(js|jsx|ts|tsx)$/, '');
  
  // Handle index pages
  if (pagePathWithoutExt === 'index') {
    return path.join(outputDir, 'index.html');
  } else if (pagePathWithoutExt.endsWith('/index')) {
    return path.join(outputDir, pagePathWithoutExt.replace(/\/index$/, ''), 'index.html');
  }
  
  // Handle other pages
  return path.join(outputDir, pagePathWithoutExt, 'index.html');
}

/**
 * Get the output path for a dynamic page
 * @param {string} pageFile - Path to the page file
 * @param {Object} params - Dynamic parameters
 * @param {string} outputDir - Directory to write HTML files
 * @returns {string} - Path to the output HTML file
 */
function getDynamicOutputPath(pageFile, params, outputDir) {
  // Remove the file extension
  let pagePathWithoutExt = pageFile.replace(/\.(js|jsx|ts|tsx)$/, '');
  
  // Replace dynamic segments with parameter values
  for (const [key, value] of Object.entries(params)) {
    pagePathWithoutExt = pagePathWithoutExt.replace(`[${key}]`, value);
  }
  
  // Handle index pages
  if (pagePathWithoutExt === 'index') {
    return path.join(outputDir, 'index.html');
  } else if (pagePathWithoutExt.endsWith('/index')) {
    return path.join(outputDir, pagePathWithoutExt.replace(/\/index$/, ''), 'index.html');
  }
  
  // Handle other pages
  return path.join(outputDir, pagePathWithoutExt, 'index.html');
}

module.exports = {
  generateStaticPage,
  generateStaticSite
};
