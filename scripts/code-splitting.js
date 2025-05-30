'use strict';

const path = require('path');
const fs = require('fs-extra');
const esbuild = require('esbuild');

/**
 * Get all page files in a directory
 * @param {string} dir - Directory to search
 * @param {string} prefix - Prefix for recursive calls
 * @returns {Promise<Array<string>>} - Paths to page files
 */
async function getPageFiles(dir, prefix = '') {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    const files = [];
    
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip API routes
        if (entry.name === 'api') continue;
        
        // Recursively get files in subdirectories
        const subFiles = await getPageFiles(entryPath, path.join(prefix, entry.name));
        files.push(...subFiles);
      } else if (
        entry.name.endsWith('.js') || 
        entry.name.endsWith('.jsx') || 
        entry.name.endsWith('.ts') || 
        entry.name.endsWith('.tsx')
      ) {
        // Skip special files
        if (entry.name.startsWith('_')) continue;
        
        // Add page files
        files.push(path.join(prefix, entry.name));
      }
    }
    
    return files;
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

/**
 * Build client-side JavaScript with code splitting
 * @param {Object} options - Build options
 * @param {string} options.dir - Root directory
 * @param {string} options.outdir - Output directory
 * @param {boolean} options.minify - Whether to minify the output
 * @param {boolean} options.sourcemap - Whether to generate sourcemaps
 * @param {string} [options.chunkNames] - Custom chunk naming pattern
 * @returns {Promise<void>}
 */
async function buildWithCodeSplitting({ dir, outdir, minify = true, sourcemap = true, chunkNames }) {
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
      chunkNames: chunkNames || 'chunks/[name]-[hash]',
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

module.exports = {
  buildWithCodeSplitting
};
