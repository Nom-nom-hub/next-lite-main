#!/usr/bin/env node
/**
 * Next-Lite CLI
 * Command-line interface for Next-Lite
 */
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Available templates
const TEMPLATES = {
  basic: {
    name: 'Basic',
    description: 'A basic Next-Lite app with a home page and about page',
  },
  blog: {
    name: 'Blog',
    description: 'A blog template with posts and dynamic routes',
  },
  dashboard: {
    name: 'Dashboard',
    description: 'A dashboard template with charts and UI components',
  },
  api: {
    name: 'API',
    description: 'A template focused on API routes and data fetching',
  },
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Parse command-line arguments
const args = process.argv.slice(2);
const command = args[0];

// Main function
async function main() {
  switch (command) {
    case 'create':
      await createApp();
      break;
    
    case 'dev':
      runDev();
      break;
    
    case 'build':
      runBuild();
      break;
    
    case 'start':
      runStart();
      break;
    
    case 'analyze':
      runAnalyze();
      break;
    
    case 'lint':
      runLint();
      break;
    
    case 'test':
      runTest();
      break;
    
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    
    case 'version':
    case '--version':
    case '-v':
      showVersion();
      break;
    
    default:
      if (!command) {
        showHelp();
      } else {
        console.error(`Unknown command: ${command}`);
        console.log('Run "next-lite help" to see available commands');
      }
      process.exit(1);
  }
}

/**
 * Create a new Next-Lite app
 */
async function createApp() {
  const appName = args[1];
  
  if (!appName) {
    console.error('Please specify an app name');
    console.log('Example: next-lite create my-app');
    process.exit(1);
  }
  
  const appPath = path.resolve(process.cwd(), appName);
  
  // Check if directory already exists
  if (fs.existsSync(appPath)) {
    const answer = await question(`Directory ${appName} already exists. Do you want to overwrite it? (y/N) `);
    
    if (answer.toLowerCase() !== 'y') {
      console.log('Aborting...');
      process.exit(0);
    }
    
    // Remove existing directory
    fs.removeSync(appPath);
  }
  
  // Create app directory
  fs.ensureDirSync(appPath);
  
  // Ask for template
  console.log('\nAvailable templates:');
  Object.entries(TEMPLATES).forEach(([key, template]) => {
    console.log(`  ${key}: ${template.name} - ${template.description}`);
  });
  
  const templateKey = await question('\nSelect a template (basic): ') || 'basic';
  
  if (!TEMPLATES[templateKey]) {
    console.error(`Unknown template: ${templateKey}`);
    process.exit(1);
  }
  
  // Ask for TypeScript
  const useTypeScript = (await question('Use TypeScript? (Y/n) ')).toLowerCase() !== 'n';
  
  // Create app
  console.log(`\nCreating a new Next-Lite app in ${appPath}...`);
  
  // Copy template files
  const templatePath = path.join(__dirname, '..', 'templates', templateKey);
  
  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templateKey}`);
    process.exit(1);
  }
  
  // Copy template files
  fs.copySync(templatePath, appPath);
  
  // Create package.json
  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next-lite dev',
      build: 'next-lite build',
      start: 'next-lite start',
      lint: 'next-lite lint',
      test: 'next-lite test',
    },
    dependencies: {
      'react': '^18.3.1',
      'react-dom': '^18.3.1',
      'next-lite': '^0.1.0',
    },
    devDependencies: {},
  };
  
  // Add TypeScript dependencies if needed
  if (useTypeScript) {
    packageJson.devDependencies['typescript'] = '^5.7.3';
    packageJson.devDependencies['@types/react'] = '^18.3.18';
    packageJson.devDependencies['@types/react-dom'] = '^18.3.5';
    packageJson.devDependencies['@types/node'] = '^20.11.0';
  }
  
  // Write package.json
  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create tsconfig.json if using TypeScript
  if (useTypeScript) {
    const tsConfig = {
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
      },
      include: ['**/*.ts', '**/*.tsx'],
      exclude: ['node_modules'],
    };
    
    fs.writeFileSync(
      path.join(appPath, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
  }
  
  // Create next-lite.config.js
  const nextLiteConfig = `/**
 * Next-Lite configuration
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
};
`;
  
  fs.writeFileSync(
    path.join(appPath, 'next-lite.config.js'),
    nextLiteConfig
  );
  
  // Create README.md
  const readme = `# ${appName}

This is a [Next-Lite](https://github.com/teckcode/next-lite) project.

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next-Lite, take a look at the following resources:

- [Next-Lite Documentation](https://github.com/teckcode/next-lite/tree/main/docs)
- [Next-Lite GitHub Repository](https://github.com/teckcode/next-lite)
`;
  
  fs.writeFileSync(
    path.join(appPath, 'README.md'),
    readme
  );
  
  // Create .gitignore
  const gitignore = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next-lite
/.next/
/dist/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
`;
  
  fs.writeFileSync(
    path.join(appPath, '.gitignore'),
    gitignore
  );
  
  // Install dependencies
  console.log('\nInstalling dependencies...');
  
  try {
    execSync('npm install', { cwd: appPath, stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to install dependencies');
    process.exit(1);
  }
  
  // Success message
  console.log(`
✅ Success! Created ${appName} at ${appPath}

Inside that directory, you can run several commands:

  npm run dev
    Starts the development server.

  npm run build
    Builds the app for production.

  npm run start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd ${appName}
  npm run dev

Happy coding! 🚀
`);
  
  process.exit(0);
}

/**
 * Run development server
 */
function runDev() {
  const devArgs = args.slice(1);
  
  try {
    execSync(`node scripts/dev.js ${devArgs.join(' ')}`, {
      stdio: 'inherit',
    });
  } catch (error) {
    process.exit(1);
  }
}

/**
 * Run build
 */
function runBuild() {
  const buildArgs = args.slice(1);
  
  try {
    execSync(`node scripts/build.js ${buildArgs.join(' ')}`, {
      stdio: 'inherit',
    });
  } catch (error) {
    process.exit(1);
  }
}

/**
 * Run production server
 */
function runStart() {
  const startArgs = args.slice(1);
  
  try {
    execSync(`node scripts/prod-server.js ${startArgs.join(' ')}`, {
      stdio: 'inherit',
    });
  } catch (error) {
    process.exit(1);
  }
}

/**
 * Run bundle analyzer
 */
function runAnalyze() {
  try {
    execSync('node scripts/build.js --analyze', {
      stdio: 'inherit',
    });
  } catch (error) {
    process.exit(1);
  }
}

/**
 * Run linter
 */
function runLint() {
  try {
    execSync('eslint . --ext .js,.jsx,.ts,.tsx', {
      stdio: 'inherit',
    });
  } catch (error) {
    process.exit(1);
  }
}

/**
 * Run tests
 */
function runTest() {
  const testArgs = args.slice(1);
  
  try {
    execSync(`jest ${testArgs.join(' ')}`, {
      stdio: 'inherit',
    });
  } catch (error) {
    process.exit(1);
  }
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
Next-Lite CLI

Usage:
  next-lite <command> [options]

Commands:
  create <app-name>  Create a new Next-Lite app
  dev                Start development server
  build              Build for production
  start              Start production server
  analyze            Analyze bundle size
  lint               Run linter
  test               Run tests
  help               Show help
  version            Show version

Options:
  --help, -h         Show help
  --version, -v      Show version

Examples:
  next-lite create my-app
  next-lite dev
  next-lite build --ssr
  next-lite start --ssr
  next-lite analyze
  next-lite lint
  next-lite test
`);
  
  process.exit(0);
}

/**
 * Show version
 */
function showVersion() {
  const packageJson = require('../package.json');
  console.log(`Next-Lite v${packageJson.version}`);
  process.exit(0);
}

/**
 * Ask a question and get the answer
 * @param {string} question - Question to ask
 * @returns {Promise<string>} - Answer
 */
function question(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Run main function
main().finally(() => {
  rl.close();
});
