const esbuild = require('esbuild');
const fs = require('fs-extra');
const path = require('path');
const cssModulesPlugin = require('./css-modules-plugin');
const { buildForSSR } = require('./ssr');
const dotenv = require('dotenv');
const config = require('./config');
const {
  codeSplittingPlugin,
  treeShakingPlugin,
  compressionPlugin,
  generateBundleReport,
  optimizeImages
} = require('./performance-optimizations');

// Load environment variables
dotenv.config();

async function build(options = {}) {
  // Merge command line options with config
  const {
    enableSSR = config.rendering.ssr,
    staticExport = config.rendering.staticExport,
    minify = config.build.minify,
    sourcemap = config.build.sourcemap,
    target = config.build.target,
    outDir = config.build.outDir,
    analyze = false,
    optimizeImg = true,
    compress = true,
    splitting = true,
  } = options;

  console.log(`🧹 Cleaning ${outDir} directory...`);
  await fs.emptyDir(outDir);
  await fs.ensureDir(path.join(outDir, 'static'));

  // Create plugins array with performance optimizations
  const plugins = [
    cssModulesPlugin(),
  ];

  // Add code splitting plugin if enabled
  if (splitting) {
    plugins.push(codeSplittingPlugin());
    console.log('📌 Adding code splitting optimization');
  }

  // Add tree shaking plugin
  plugins.push(treeShakingPlugin());
  console.log('🌳 Adding tree shaking optimization');

  // Add compression plugin if enabled
  if (compress) {
    plugins.push(compressionPlugin());
    console.log('📦 Adding compression optimization');
  }

  // Define environment variables for the build
  const env = {};

  // Add environment variables from .env files
  for (const key in process.env) {
    if (key.startsWith('NEXT_LITE_')) {
      env[`process.env.${key}`] = JSON.stringify(process.env[key]);
    }
  }

  // Add environment variables from config
  for (const key in config.env) {
    env[`process.env.${key}`] = JSON.stringify(config.env[key]);
  }

  // Always include NODE_ENV
  env['process.env.NODE_ENV'] = '"production"';

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
        'scripts/prod-server.js',
        'scripts/ssr.js'
      ],
      bundle: true,
      outdir: outDir,
      format: 'cjs',
      platform: 'node',
      target: 'node14', // Always use node14 for server code
      external: ['esbuild', 'fs-extra', 'ws', 'react', 'react-dom'],
      plugins,
      minify,
      sourcemap,
      define: env,
    });

    // Build client bundle
    await esbuild.build({
      entryPoints: ['example/client.tsx'],
      bundle: true,
      outfile: path.join(outDir, 'static', 'client.js'),
      format: 'esm',
      platform: 'browser',
      target,
      jsx: 'automatic',
      jsxImportSource: 'react',
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.css': 'css'
      },
      plugins,
      splitting: splitting, // Enable code splitting
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      minify,
      sourcemap,
      define: env,
    });

    // Build SSR bundle if enabled
    if (enableSSR) {
      console.log('🔄 Building SSR bundle...');
      await buildForSSR(
        path.join(process.cwd(), 'example', 'pages'),
        path.join(process.cwd(), outDir, 'ssr')
      );
    }

    // Generate static export if enabled
    if (staticExport) {
      console.log('📄 Generating static export...');
      await generateStaticExport();
    }

    // Copy necessary files
    await fs.copy('example/index.html', path.join(outDir, 'template.html'));
    await fs.copy('package.json', path.join(outDir, 'package.json'));
    await fs.copy('README.md', path.join(outDir, 'README.md'));
    await fs.copy('LICENSE', path.join(outDir, 'LICENSE'));

    // Copy config file if it exists
    if (fs.existsSync('next-lite.config.js')) {
      await fs.copy('next-lite.config.js', path.join(outDir, 'next-lite.config.js'));
    }

    // Copy public directory if it exists
    if (fs.existsSync('public')) {
      await fs.copy('public', path.join(outDir, 'public'));

      // Optimize images if enabled
      if (optimizeImg) {
        console.log('🖼 Optimizing images...');
        await optimizeImages(path.join(outDir, 'public'));
      }
    }

    // Generate bundle report if analyze is enabled
    if (analyze) {
      console.log('📈 Analyzing bundle...');
      await generateBundleReport(outDir);
    }

    console.log('✨ Build complete!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

/**
 * Generate a static export of the site
 */
async function generateStaticExport() {
  const { renderPage } = require('./ssr');
  const pagesDir = path.join(process.cwd(), 'example', 'pages');
  const exportDir = path.join(process.cwd(), outDir, 'export');

  // Ensure export directory exists
  await fs.ensureDir(exportDir);

  // Get all pages
  const pages = [];
  const scanPages = (dir, prefix = '') => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith('api') || entry.name.startsWith('_')) {
        continue; // Skip API routes and special files
      }

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanPages(fullPath, `${prefix}/${entry.name}`);
      } else {
        const ext = path.extname(entry.name);
        if (ext === '.tsx' || ext === '.jsx' || ext === '.js') {
          const routePath = prefix + '/' + entry.name.replace(/\.[^/.]+$/, '');
          const finalRoute = routePath === '/index' ? '/' : routePath;

          pages.push({
            route: finalRoute,
            component: fullPath,
          });
        }
      }
    }
  };

  scanPages(pagesDir);

  // Render each page
  for (const page of pages) {
    console.log(`Rendering page: ${page.route}`);

    try {
      const html = await renderPage(page.component, {});

      // Determine output path
      let outputPath;
      if (page.route === '/') {
        outputPath = path.join(exportDir, 'index.html');
      } else {
        const routePath = page.route.slice(1); // Remove leading slash
        outputPath = path.join(exportDir, routePath);
        await fs.ensureDir(path.dirname(outputPath));
        outputPath = path.join(outputPath, 'index.html');
      }

      // Write the file
      await fs.writeFile(outputPath, html);
    } catch (error) {
      console.error(`Error rendering ${page.route}:`, error);
    }
  }

  // Copy static assets
  await fs.copy(path.join(process.cwd(), outDir, 'static'), path.join(exportDir, 'static'));

  // Copy public directory if it exists
  if (fs.existsSync('public')) {
    await fs.copy('public', exportDir);
  }

  console.log(`✅ Static export complete. Output in ${exportDir}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  // Command line arguments take precedence over config
  enableSSR: args.includes('--ssr') || config.rendering.ssr,
  staticExport: args.includes('--static') || config.rendering.staticExport,
  minify: args.includes('--no-minify') ? false : config.build.minify,
  sourcemap: args.includes('--no-sourcemap') ? false : config.build.sourcemap,
  target: config.build.target,
  outDir: config.build.outDir,
  analyze: args.includes('--analyze'),
  optimizeImg: !args.includes('--no-optimize-images'),
  compress: !args.includes('--no-compress'),
  splitting: !args.includes('--no-code-splitting'),
};

// Log configuration
console.log('Building with configuration:');
console.log(`- SSR: ${options.enableSSR}`);
console.log(`- Static Export: ${options.staticExport}`);
console.log(`- Minify: ${options.minify}`);
console.log(`- Sourcemap: ${options.sourcemap}`);
console.log(`- Target: ${options.target}`);
console.log(`- Output Directory: ${options.outDir}`);
console.log(`- Analyze Bundle: ${options.analyze}`);
console.log(`- Optimize Images: ${options.optimizeImg}`);
console.log(`- Compression: ${options.compress}`);
console.log(`- Code Splitting: ${options.splitting}`);

build(options);
