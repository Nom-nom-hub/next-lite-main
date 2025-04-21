/**
 * Next-Lite configuration for Tailwind CSS integration
 */
module.exports = {
  // Server configuration
  server: {
    port: 3000,
    host: 'localhost',
  },
  
  // Build configuration
  build: {
    target: 'es2015',
    minify: true,
    sourcemap: true,
    outDir: 'dist',
  },
  
  // Rendering options
  rendering: {
    ssr: false,
    staticExport: false,
  },
  
  // Plugins
  plugins: [
    // Tailwind CSS Plugin
    {
      name: 'tailwind-css',
      hooks: {
        beforeBuild: async (config) => {
          const postcss = require('postcss');
          const tailwindcss = require('tailwindcss');
          const autoprefixer = require('autoprefixer');
          const fs = require('fs-extra');
          const path = require('path');
          
          console.log('Processing Tailwind CSS...');
          
          // Read the CSS file
          const cssFile = path.join(process.cwd(), 'styles', 'globals.css');
          const css = await fs.readFile(cssFile, 'utf8');
          
          // Process the CSS with Tailwind
          const result = await postcss([
            tailwindcss('./tailwind.config.js'),
            autoprefixer,
          ]).process(css, {
            from: cssFile,
            to: path.join(process.cwd(), 'dist', 'static', 'globals.css'),
          });
          
          // Write the processed CSS
          await fs.ensureDir(path.join(process.cwd(), 'dist', 'static'));
          await fs.writeFile(
            path.join(process.cwd(), 'dist', 'static', 'globals.css'),
            result.css
          );
          
          console.log('Tailwind CSS processed successfully');
          
          return config;
        },
      },
    },
  ],
};
