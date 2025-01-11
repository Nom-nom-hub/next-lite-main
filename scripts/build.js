const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs-extra');
const cssModulesPlugin = require('./css-modules-plugin');

async function build() {
  // Clean the dist directory
  console.log('🧹 Cleaning dist directory...');
  await fs.remove(path.join(process.cwd(), 'dist'));

  try {
    console.log('📦 Building production bundle...');
    
    // Copy static files
    await fs.copy(
      path.join(process.cwd(), 'example', 'public'),
      path.join(process.cwd(), 'dist', 'public'),
      { overwrite: true }
    );

    // Copy and modify index.html
    const indexHtml = await fs.readFile(
      path.join(process.cwd(), 'example', 'index.html'),
      'utf-8'
    );
    
    // Modify index.html to use production scripts
    const modifiedHtml = indexHtml
      .replace('/.next/static/client.js', '/static/client.js')
      .replace(
        '</head>',
        `
        <link rel="stylesheet" href="/static/client.css">
        </head>
        `
      );

    await fs.outputFile(
      path.join(process.cwd(), 'dist', 'index.html'),
      modifiedHtml
    );

    // Build the client bundle
    await esbuild.build({
      entryPoints: ['example/client.tsx'],
      bundle: true,
      minify: true,
      splitting: true,
      format: 'esm',
      target: ['es2020'],
      outdir: 'dist/static',
      metafile: true,
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.css': 'css',
      },
      plugins: [cssModulesPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      external: ['react', 'react-dom'],
      sourcemap: true,
      treeShaking: true,
      chunkNames: 'chunks/[name]-[hash]',
      assetNames: 'assets/[name]-[hash]',
      publicPath: '/static/',
      banner: {
        js: '/* Next-Lite - https://github.com/yourusername/next-lite */',
      },
    });

    // Build API routes
    console.log('🚀 Building API routes...');
    const apiDir = path.join(process.cwd(), 'example', 'pages', 'api');
    const apiDistDir = path.join(process.cwd(), 'dist', 'api');
    
    if (fs.existsSync(apiDir)) {
      const apiFiles = await fs.readdir(apiDir);
      for (const file of apiFiles) {
        if (file.endsWith('.ts') || file.endsWith('.js')) {
          await esbuild.build({
            entryPoints: [path.join(apiDir, file)],
            bundle: true,
            platform: 'node',
            target: 'node14',
            format: 'cjs',
            outdir: apiDistDir,
            minify: true,
          });
        }
      }
    }

    // Generate a production server
    console.log('🌐 Creating production server...');
    await esbuild.build({
      entryPoints: ['scripts/prod-server.js'],
      bundle: true,
      platform: 'node',
      target: 'node14',
      format: 'cjs',
      outfile: 'dist/server.js',
      minify: true,
    });

    console.log('✨ Production build completed successfully!');
    console.log('\nTo start the production server:');
    console.log('  node dist/server.js');

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
