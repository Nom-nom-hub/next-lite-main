const esbuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');
const cssModulesPlugin = require('./css-modules-plugin');

async function build() {
  console.log('🧹 Cleaning dist directory...');
  await fs.emptyDir('dist');

  console.log('📦 Building production bundle...');
  try {
    // Build the framework
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
      outdir: 'dist',
      format: 'cjs',
      platform: 'node',
      target: 'node14',
      external: ['esbuild', 'fs-extra', 'ws', 'react', 'react-dom'],
      plugins: [cssModulesPlugin()],
      minify: true,
      sourcemap: true,
    });

    // Copy necessary files
    await fs.copy('example/index.html', 'dist/template.html');
    await fs.copy('package.json', 'dist/package.json');
    await fs.copy('README.md', 'dist/README.md');
    await fs.copy('LICENSE', 'dist/LICENSE');

    console.log('✨ Build complete!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
