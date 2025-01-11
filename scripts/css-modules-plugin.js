const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const modulesPlugin = require('postcss-modules');

module.exports = () => ({
  name: 'css-modules',
  setup(build) {
    // Handle .module.css files
    build.onLoad({ filter: /\.module\.css$/ }, async (args) => {
      const source = await fs.promises.readFile(args.path, 'utf8');
      let cssModulesJSON = {};

      const result = await postcss([
        modulesPlugin({
          getJSON(_, json) {
            cssModulesJSON = json;
          },
          generateScopedName: '[name]_[local]_[hash:base64:5]'
        })
      ]).process(source, { from: args.path });

      const exportedClasses = JSON.stringify(cssModulesJSON, null, 2);

      return {
        contents: `
          const style = document.createElement('style');
          style.textContent = ${JSON.stringify(result.css)};
          document.head.appendChild(style);
          export default ${exportedClasses};
        `,
        loader: 'js'
      };
    });

    // Handle regular .css files
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      if (args.path.endsWith('.module.css')) return;
      const source = await fs.promises.readFile(args.path, 'utf8');

      return {
        contents: `
          const style = document.createElement('style');
          style.textContent = ${JSON.stringify(source)};
          document.head.appendChild(style);
          export default {};
        `,
        loader: 'js'
      };
    });
  }
});
