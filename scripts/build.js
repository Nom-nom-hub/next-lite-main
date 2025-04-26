const esbuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');
const cssModulesPlugin = require('./css-modules-plugin');

async function build() {
  console.log('🧹 Cleaning dist directory...');
  await fs.emptyDir('dist');

  console.log('📦 Building production bundle...');
  try {
    // Build the server bundle
    await esbuild.build({
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'dist/server.js',
      format: 'cjs',
      platform: 'node',
      target: 'node14',
      external: ['react', 'react-dom', 'canvas', 'esbuild', 'fs-extra', 'ws'],
      plugins: [cssModulesPlugin()],
      minify: true,
      sourcemap: true,
    });

    // Build the client bundle with code splitting
    const { buildWithCodeSplitting } = require('./code-splitting');
    await buildWithCodeSplitting({
      dir: process.cwd(),
      outdir: 'dist/client',
      minify: true,
      sourcemap: true
    });

    // Build the legacy framework components
    await esbuild.build({
      entryPoints: [
        'example/router.tsx',
        'scripts/route-loader.js',
        'scripts/api-router.js',
        'scripts/css-modules-plugin.js',
        'scripts/dev.js',
        'scripts/prod-server.js'
      ],
      bundle: true,
      outdir: 'dist/legacy',
      format: 'cjs',
      platform: 'node',
      target: 'node14',
      external: ['esbuild', 'fs-extra', 'ws', 'react', 'react-dom', 'canvas'],
      plugins: [cssModulesPlugin()],
      minify: true,
      sourcemap: true,
    });

    // Copy necessary files
    await fs.copy('example/index.html', 'dist/template.html');
    await fs.copy('package.json', 'dist/package.json');
    await fs.copy('README.md', 'dist/README.md');
    await fs.copy('LICENSE', 'dist/LICENSE');

    // Create the bin directory and CLI scripts
    await fs.ensureDir('dist/bin');

    // Create the dev CLI script
    await fs.writeFile('dist/bin/next-lite-dev.js', `#!/usr/bin/env node
'use strict';
const { createServer } = require('../server');
const path = require('path');

const dir = process.cwd();
const port = parseInt(process.env.PORT, 10) || 3000;

const server = createServer({ dir, port, dev: true });
server.start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
`);

    // Create the build CLI script
    await fs.writeFile('dist/bin/next-lite-build.js', `#!/usr/bin/env node
'use strict';
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const dir = process.cwd();
const buildDir = path.join(dir, '.next');

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Build client-side JavaScript
esbuild.buildSync({
  entryPoints: [path.join(dir, 'pages', '**/*.{js,jsx,ts,tsx}')],
  outdir: path.join(buildDir, 'static'),
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'esm',
  splitting: true,
  platform: 'browser',
  target: ['es2018'],
  external: ['react', 'react-dom'],
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

console.log('✨ Build complete!');
`);

    // Create the start CLI script
    await fs.writeFile('dist/bin/next-lite-start.js', `#!/usr/bin/env node
'use strict';
const { createServer } = require('../server');
const path = require('path');

const dir = process.cwd();
const port = parseInt(process.env.PORT, 10) || 3000;

const server = createServer({ dir, port, dev: false });
server.start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
`);

    // Make the CLI scripts executable
    await fs.chmod('dist/bin/next-lite-dev.js', 0o755);
    await fs.chmod('dist/bin/next-lite-build.js', 0o755);
    await fs.chmod('dist/bin/next-lite-start.js', 0o755);

    // Update package.json
    const packageJson = await fs.readJson('dist/package.json');
    packageJson.bin = {
      'next-lite': './bin/next-lite-dev.js',
      'next-lite-dev': './bin/next-lite-dev.js',
      'next-lite-build': './bin/next-lite-build.js',
      'next-lite-start': './bin/next-lite-start.js'
    };
    packageJson.main = 'server.js';
    await fs.writeJson('dist/package.json', packageJson, { spaces: 2 });

    console.log('✨ Build complete!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
