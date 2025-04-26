'use strict';

const path = require('path');
const fs = require('fs-extra');
const esbuild = require('esbuild');

/**
 * Build client-side JavaScript with code splitting
 * @param {Object} options - Build options
 * @param {string} options.dir - Root directory
 * @param {string} options.outdir - Output directory
 * @param {boolean} options.minify - Whether to minify the output
 * @param {boolean} options.sourcemap - Whether to generate sourcemaps
 * @returns {Promise<void>}
 */
async function buildWithCodeSplitting({ dir, outdir, minify = true, sourcemap = true }) {
  try {
    // Create the output directory if it doesn't exist
    await fs.ensureDir(outdir);
    
    // Get all page files
    const pagesDir = path.join(dir, 'pages');
    const pageFiles = await getPageFiles(pagesDir);
    
    // Build entry points
    const entryPoints = pageFiles.map(file => path.join(pagesDir, file));
    
    // Add the client entry point
    entryPoints.push(path.join(__dirname, '..', 'src', 'client', 'hydrate.js'));
    
    // Build with esbuild
    await esbuild.build({
      entryPoints,
      outdir,
      bundle: true,
      minify,
      sourcemap,
      format: 'esm',
      splitting: true,
      chunkNames: 'chunks/[name]-[hash]',
      target: ['es2018'],
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
      },
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.jsx': 'jsx',
        '.tsx': 'tsx',
        '.css': 'css',
        '.png': 'file',
        '.jpg': 'file',
        '.gif': 'file',
        '.svg': 'file',
        '.woff': 'file',
        '.woff2': 'file',
        '.ttf': 'file',
        '.eot': 'file'
      }
    });
    
    console.log(`✨ Built ${entryPoints.length} entry points with code splitting!`);
  } catch (error) {
    console.error('❌ Build failed:', error);
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
  const entries = await fs.readdir(dir);
  
  const files = [];
  
  for (const entry of entries) {
    const entryPath = path.join(dir, entry);
    const entryStats = await fs.stat(entryPath);
    
    if (entryStats.isDirectory()) {
      // Recursively get files in subdirectories
      const subFiles = await getPageFiles(entryPath, path.join(prefix, entry));
      files.push(...subFiles);
    } else if (entry.endsWith('.js') || entry.endsWith('.jsx') || entry.endsWith('.ts') || entry.endsWith('.tsx')) {
      // Skip API routes
      if (prefix.startsWith('api/') || entry.startsWith('api/')) {
        continue;
      }
      
      // Add page files
      files.push(path.join(prefix, entry));
    }
  }
  
  return files;
}

module.exports = {
  buildWithCodeSplitting
};
