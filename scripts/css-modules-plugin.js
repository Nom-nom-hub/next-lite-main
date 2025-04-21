const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const modulesPlugin = require('postcss-modules');
const crypto = require('crypto');

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

// Function to generate a hash for content
function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

module.exports = (options = {}) => ({
  name: 'css-modules',
  setup(build) {
    // Track all CSS files for extraction in production
    const cssFiles = new Map();
    const globalCssFiles = new Map();
    // Handle .module.css files
    build.onLoad({ filter: /\.module\.css$/ }, async (args) => {
      const source = await fs.readFile(args.path, 'utf8');
      let cssModulesJSON = {};

      const result = await postcss([
        modulesPlugin({
          getJSON(_, json) {
            cssModulesJSON = json;
          },
          generateScopedName: isProduction
            ? '[hash:base64:8]' // More compact in production
            : '[name]_[local]_[hash:base64:5]' // More readable in development
        })
      ]).process(source, { from: args.path });

      const exportedClasses = JSON.stringify(cssModulesJSON, null, 2);
      const cssContent = result.css;
      const filePath = args.path;
      const fileHash = generateHash(cssContent);

      // Store CSS content for extraction in production
      cssFiles.set(filePath, {
        content: cssContent,
        hash: fileHash
      });

      // In development, inject styles directly
      // In production, they'll be extracted to a separate file
      return {
        contents: `
          ${isProduction
            ? `// CSS will be extracted to a separate file in production
               // Import the CSS to ensure it's included in the build
               import '${filePath}';
              `
            : `// Inject styles in development
               const style = document.createElement('style');
               style.textContent = ${JSON.stringify(cssContent)};
               style.setAttribute('data-module-id', '${fileHash}');
               if (!document.head.querySelector('[data-module-id="${fileHash}"]')) {
                 document.head.appendChild(style);
               }
              `
          }
          export default ${exportedClasses};
        `,
        loader: 'js'
      };
    });

    // Handle global .css files
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      if (args.path.endsWith('.module.css')) return;

      // Handle global.css files specially
      const isGlobalCss = args.path.includes('global.css');
      const source = await fs.readFile(args.path, 'utf8');
      const fileHash = generateHash(source);

      // Store CSS content for extraction in production
      if (isGlobalCss) {
        globalCssFiles.set(args.path, {
          content: source,
          hash: fileHash
        });
      } else {
        cssFiles.set(args.path, {
          content: source,
          hash: fileHash
        });
      }

      // In development, inject styles directly
      // In production, they'll be extracted to a separate file
      return {
        contents: `
          ${isProduction
            ? `// CSS will be extracted to a separate file in production
               // Import the CSS to ensure it's included in the build
               import '${args.path}';
              `
            : `// Inject styles in development
               const style = document.createElement('style');
               style.textContent = ${JSON.stringify(source)};
               style.setAttribute('data-css-id', '${fileHash}');
               if (!document.head.querySelector('[data-css-id="${fileHash}"]')) {
                 document.head.appendChild(style);
               }
              `
          }
          export default {};
        `,
        loader: 'js'
      };
    });

    // Extract CSS to separate files in production
    if (isProduction) {
      build.onEnd(async (result) => {
        if (result.errors.length > 0) return;

        // Create output directory for CSS
        const cssOutDir = path.join(process.cwd(), '.next', 'static', 'css');
        await fs.ensureDir(cssOutDir);

        // Extract global CSS first (should be loaded before module CSS)
        if (globalCssFiles.size > 0) {
          const globalCssContent = Array.from(globalCssFiles.values())
            .map(file => file.content)
            .join('\n');

          const globalCssPath = path.join(cssOutDir, 'global.css');
          await fs.writeFile(globalCssPath, globalCssContent);
          console.log(`Extracted global CSS to ${globalCssPath}`);
        }

        // Extract module CSS
        if (cssFiles.size > 0) {
          const modulesCssContent = Array.from(cssFiles.values())
            .map(file => file.content)
            .join('\n');

          const modulesCssPath = path.join(cssOutDir, 'modules.css');
          await fs.writeFile(modulesCssPath, modulesCssContent);
          console.log(`Extracted module CSS to ${modulesCssPath}`);
        }
      });
    }
  }
});
