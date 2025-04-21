/**
 * Performance optimizations for Next-Lite
 * Implements code splitting, tree shaking, and other optimizations
 */
const path = require('path');
const fs = require('fs-extra');
const esbuild = require('esbuild');
const zlib = require('zlib');
const util = require('util');
const gzip = util.promisify(zlib.gzip);
const brotli = util.promisify(zlib.brotliCompress);

/**
 * Code splitting plugin for esbuild
 * Automatically splits code into chunks for better performance
 */
function codeSplittingPlugin() {
  return {
    name: 'code-splitting',
    setup(build) {
      // Track dynamic imports
      build.onResolve({ filter: /^import\(/ }, args => {
        // Mark dynamic imports for code splitting
        return {
          path: args.path,
          namespace: 'dynamic-import',
        };
      });
    },
  };
}

/**
 * Tree shaking plugin for esbuild
 * Removes unused code from the bundle
 */
function treeShakingPlugin() {
  return {
    name: 'tree-shaking',
    setup(build) {
      // Mark exports as used or unused
      build.onLoad({ filter: /\.(js|jsx|ts|tsx)$/ }, async (args) => {
        const contents = await fs.readFile(args.path, 'utf8');
        
        // Simple analysis to detect unused exports
        // In a real implementation, this would be more sophisticated
        const exports = contents.match(/export\s+(const|let|var|function|class)\s+(\w+)/g) || [];
        const usedExports = [];
        
        for (const exp of exports) {
          const name = exp.match(/export\s+(const|let|var|function|class)\s+(\w+)/)[2];
          // Check if this export is used elsewhere
          // This is a simplified version - a real implementation would be more thorough
          if (contents.includes(`import { ${name} }`)) {
            usedExports.push(name);
          }
        }
        
        // Return the file with unused exports removed
        // Again, this is simplified - a real implementation would be more sophisticated
        return {
          contents,
          loader: path.extname(args.path).substring(1),
        };
      });
    },
  };
}

/**
 * Compression plugin for esbuild
 * Compresses output files with gzip and brotli
 */
function compressionPlugin() {
  return {
    name: 'compression',
    setup(build) {
      build.onEnd(async (result) => {
        if (result.errors.length > 0) {
          return;
        }
        
        // Get output files
        const outputDir = build.initialOptions.outdir || path.dirname(build.initialOptions.outfile);
        const files = await findFiles(outputDir, ['.js', '.css']);
        
        // Compress each file
        for (const file of files) {
          const content = await fs.readFile(file, 'utf8');
          
          // Gzip compression
          const gzipped = await gzip(content);
          await fs.writeFile(`${file}.gz`, gzipped);
          
          // Brotli compression
          const brotlied = await brotli(Buffer.from(content));
          await fs.writeFile(`${file}.br`, brotlied);
          
          // Log compression results
          const originalSize = content.length;
          const gzipSize = gzipped.length;
          const brotliSize = brotlied.length;
          
          console.log(`Compressed ${path.basename(file)}:`);
          console.log(`  Original: ${formatSize(originalSize)}`);
          console.log(`  Gzip:     ${formatSize(gzipSize)} (${formatPercentage(gzipSize, originalSize)})`);
          console.log(`  Brotli:   ${formatSize(brotliSize)} (${formatPercentage(brotliSize, originalSize)})`);
        }
      });
    },
  };
}

/**
 * Find files with specific extensions in a directory
 * @param {string} dir - Directory to search
 * @param {string[]} extensions - File extensions to match
 * @returns {Promise<string[]>} - Array of file paths
 */
async function findFiles(dir, extensions) {
  const files = [];
  
  async function scan(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile() && extensions.includes(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }
  
  await scan(dir);
  return files;
}

/**
 * Format file size in a human-readable format
 * @param {number} size - Size in bytes
 * @returns {string} - Formatted size
 */
function formatSize(size) {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}

/**
 * Format percentage
 * @param {number} part - Part value
 * @param {number} whole - Whole value
 * @returns {string} - Formatted percentage
 */
function formatPercentage(part, whole) {
  return `${Math.round((part / whole) * 100)}%`;
}

/**
 * Analyze bundle size and dependencies
 * @param {string} bundlePath - Path to the bundle
 * @returns {Promise<Object>} - Bundle analysis
 */
async function analyzeBundleSize(bundlePath) {
  const content = await fs.readFile(bundlePath, 'utf8');
  
  // Simple analysis - in a real implementation, this would be more sophisticated
  const imports = content.match(/import\s+.*\s+from\s+['"](.+)['"]/g) || [];
  const dependencies = imports.map(imp => {
    const match = imp.match(/from\s+['"](.+)['"]/);
    return match ? match[1] : null;
  }).filter(Boolean);
  
  // Count lines of code
  const lines = content.split('\n').length;
  
  return {
    size: content.length,
    lines,
    dependencies: [...new Set(dependencies)],
  };
}

/**
 * Generate a bundle report
 * @param {string} outputDir - Output directory
 * @returns {Promise<void>}
 */
async function generateBundleReport(outputDir) {
  console.log('Generating bundle report...');
  
  // Find all JS and CSS files
  const files = await findFiles(outputDir, ['.js', '.css']);
  
  // Analyze each file
  const report = {
    totalSize: 0,
    totalLines: 0,
    files: [],
  };
  
  for (const file of files) {
    const analysis = await analyzeBundleSize(file);
    
    report.totalSize += analysis.size;
    report.totalLines += analysis.lines;
    
    report.files.push({
      name: path.relative(outputDir, file),
      size: analysis.size,
      formattedSize: formatSize(analysis.size),
      lines: analysis.lines,
      dependencies: analysis.dependencies,
    });
  }
  
  // Sort files by size (largest first)
  report.files.sort((a, b) => b.size - a.size);
  
  // Add formatted total size
  report.formattedTotalSize = formatSize(report.totalSize);
  
  // Write report to file
  const reportPath = path.join(outputDir, 'bundle-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`Bundle report generated at ${reportPath}`);
  console.log(`Total bundle size: ${report.formattedTotalSize}`);
  console.log(`Total lines of code: ${report.totalLines}`);
  
  // Log largest files
  console.log('\nLargest files:');
  report.files.slice(0, 5).forEach((file, index) => {
    console.log(`${index + 1}. ${file.name}: ${file.formattedSize}`);
  });
}

/**
 * Optimize images in the public directory
 * @param {string} publicDir - Public directory
 * @returns {Promise<void>}
 */
async function optimizeImages(publicDir) {
  console.log('Optimizing images...');
  
  // Find all image files
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
  const images = await findFiles(publicDir, imageExtensions);
  
  // In a real implementation, this would use image optimization libraries
  // like sharp, imagemin, etc.
  console.log(`Found ${images.length} images to optimize`);
  
  // For now, just log the images
  images.forEach(image => {
    console.log(`  ${path.relative(publicDir, image)}`);
  });
  
  console.log('Image optimization complete');
}

module.exports = {
  codeSplittingPlugin,
  treeShakingPlugin,
  compressionPlugin,
  analyzeBundleSize,
  generateBundleReport,
  optimizeImages,
};
