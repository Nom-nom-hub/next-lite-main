const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Simple CSS modules plugin for esbuild
function cssModulesPlugin() {
  return {
    name: 'css-modules',
    setup(build) {
      // Cache for processed CSS modules
      const cssModulesCache = new Map();

      // Handle .module.css files
      build.onLoad({ filter: /\.module\.css$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf8');
        
        // Check cache
        const cacheKey = `${args.path}:${source}`;
        if (cssModulesCache.has(cacheKey)) {
          return cssModulesCache.get(cacheKey);
        }
        
        // Process CSS modules
        const filename = path.basename(args.path);
        const classNames = {};
        
        // Extract class names from CSS
        const processedCSS = source.replace(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g, (match, className) => {
          // Generate a unique hash for the class name
          const hash = crypto.createHash('md5')
            .update(`${filename}:${className}`)
            .digest('hex')
            .slice(0, 8);
          
          // Create a scoped class name
          const scopedName = `${className}_${hash}`;
          classNames[className] = scopedName;
          
          return `.${scopedName}`;
        });
        
        // Create JS module that exports the class names mapping
        const js = `
          // Injected CSS
          const styleSheet = document.createElement('style');
          styleSheet.textContent = ${JSON.stringify(processedCSS)};
          document.head.appendChild(styleSheet);
          
          // Export class names mapping
          export default ${JSON.stringify(classNames)};
        `;
        
        const result = {
          contents: js,
          loader: 'js',
        };
        
        // Cache the result
        cssModulesCache.set(cacheKey, result);
        
        return result;
      });
    },
  };
}

module.exports = cssModulesPlugin;
