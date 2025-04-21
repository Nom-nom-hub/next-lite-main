#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Available templates
const TEMPLATES = {
  basic: 'Basic React application',
  blog: 'Blog template with multiple pages',
  dashboard: 'Admin dashboard template',
  api: 'API-focused application',
};

// Project creation options
let projectName = '';
let template = 'basic';
let useTypeScript = true;
let installDeps = true;

/**
 * Ask a question and get user input
 * @param {string} question - The question to ask
 * @returns {Promise<string>} - User's answer
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Main function to create a new Next-Lite app
 */
async function createApp() {
  console.log('\n🚀 Welcome to Next-Lite App Creator!\n');
  
  // Get project name
  projectName = process.argv[2];
  if (!projectName) {
    projectName = await askQuestion('What is the name of your project? ');
    if (!projectName) {
      console.error('❌ Project name is required');
      process.exit(1);
    }
  }
  
  // Validate project name
  if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
    console.error('❌ Project name can only contain letters, numbers, hyphens, and underscores');
    process.exit(1);
  }
  
  // Check if directory already exists
  const projectDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(projectDir)) {
    const overwrite = await askQuestion(`Directory ${projectName} already exists. Overwrite? (y/N) `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Operation cancelled');
      process.exit(0);
    }
    fs.removeSync(projectDir);
  }
  
  // Select template
  console.log('\nAvailable templates:');
  Object.entries(TEMPLATES).forEach(([key, desc]) => {
    console.log(`  ${key}: ${desc}`);
  });
  
  const selectedTemplate = await askQuestion('\nSelect a template (default: basic): ');
  if (selectedTemplate && TEMPLATES[selectedTemplate]) {
    template = selectedTemplate;
  }
  
  // TypeScript option
  const tsOption = await askQuestion('Use TypeScript? (Y/n): ');
  useTypeScript = tsOption.toLowerCase() !== 'n';
  
  // Install dependencies option
  const installOption = await askQuestion('Install dependencies? (Y/n): ');
  installDeps = installOption.toLowerCase() !== 'n';
  
  // Create project
  console.log(`\n📁 Creating a new Next-Lite app in ${projectDir}`);
  console.log(`🔧 Template: ${template}`);
  console.log(`🔤 TypeScript: ${useTypeScript ? 'Yes' : 'No'}`);
  
  // Create project directory
  fs.mkdirSync(projectDir, { recursive: true });
  
  try {
    // Copy template files
    await copyTemplate(template, projectDir, useTypeScript);
    
    // Create package.json
    createPackageJson(projectDir, projectName);
    
    // Create tsconfig.json if using TypeScript
    if (useTypeScript) {
      createTsConfig(projectDir);
    }
    
    // Install dependencies
    if (installDeps) {
      console.log('\n📦 Installing dependencies...');
      execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
    }
    
    console.log(`\n✅ Success! Created ${projectName} at ${projectDir}`);
    console.log('\nInside that directory, you can run several commands:');
    console.log('\n  npm run dev');
    console.log('    Starts the development server.');
    console.log('\n  npm run build');
    console.log('    Builds the app for production.');
    console.log('\n  npm start');
    console.log('    Runs the built app in production mode.');
    console.log('\nWe suggest that you begin by typing:');
    console.log(`\n  cd ${projectName}`);
    console.log('  npm run dev\n');
    console.log('Happy coding! 🎉\n');
  } catch (error) {
    console.error('❌ Error creating project:', error);
    fs.removeSync(projectDir);
    process.exit(1);
  } finally {
    rl.close();
  }
}

/**
 * Copy template files to project directory
 * @param {string} template - Template name
 * @param {string} projectDir - Project directory
 * @param {boolean} useTypeScript - Whether to use TypeScript
 */
async function copyTemplate(template, projectDir, useTypeScript) {
  const templateDir = path.resolve(__dirname, '..', 'templates', template);
  
  // If template directory doesn't exist, use basic template
  if (!fs.existsSync(templateDir)) {
    console.log(`⚠️ Template "${template}" not found, using basic template instead`);
    template = 'basic';
  }
  
  // Create basic directory structure
  const dirs = [
    'pages',
    'pages/api',
    'public',
    'styles',
  ];
  
  dirs.forEach(dir => {
    fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
  });
  
  // Create basic files
  const ext = useTypeScript ? 'tsx' : 'jsx';
  
  // Create index page
  const indexContent = `import React from 'react';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.highlight}>Next-Lite</span>
        </h1>
        
        <p className={styles.description}>
          Get started by editing <code>pages/index.${ext}</code>
        </p>
        
        <div className={styles.grid}>
          <a href="https://github.com/teckmill/next-lite-main" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next-Lite features and API.</p>
          </a>
          
          <a href="https://github.com/teckmill/next-lite-main/tree/main/examples" className={styles.card}>
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy example Next-Lite projects.</p>
          </a>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <a href="https://github.com/teckmill/next-lite-main" target="_blank" rel="noopener noreferrer">
          Powered by Next-Lite
        </a>
      </footer>
    </div>
  );
}
`;
  
  // Create API example
  const apiContent = `export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Next-Lite API!' });
}
`;
  
  // Create CSS module
  const cssContent = `.container {
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.main {
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.footer {
  width: 100%;
  height: 60px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
  text-align: center;
}

.highlight {
  color: #7928CA;
}

.description {
  line-height: 1.5;
  font-size: 1.5rem;
  text-align: center;
}

.grid {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 800px;
  margin-top: 3rem;
}

.card {
  margin: 1rem;
  flex-basis: 45%;
  padding: 1.5rem;
  text-align: left;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.card:hover,
.card:focus,
.card:active {
  color: #7928CA;
  border-color: #7928CA;
}

.card h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.card p {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .grid {
    width: 100%;
    flex-direction: column;
  }
}
`;
  
  // Create global CSS
  const globalCssContent = `html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

code {
  background: #f0f0f0;
  border-radius: 5px;
  padding: 0.2em 0.4em;
  font-size: 0.9em;
}
`;
  
  // Create HTML template
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Next-Lite App</title>
  <link rel="stylesheet" href="/styles/global.css">
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18.3.1",
      "react-dom": "https://esm.sh/react-dom@18.3.1",
      "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
      "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime"
    }
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/.next/static/client.js"></script>
</body>
</html>
`;
  
  // Write files
  fs.writeFileSync(path.join(projectDir, 'pages', `index.${ext}`), indexContent);
  fs.writeFileSync(path.join(projectDir, 'pages', 'api', 'hello.js'), apiContent);
  fs.writeFileSync(path.join(projectDir, 'styles', 'Home.module.css'), cssContent);
  fs.writeFileSync(path.join(projectDir, 'styles', 'global.css'), globalCssContent);
  fs.writeFileSync(path.join(projectDir, 'index.html'), htmlContent);
  
  // Create .env file
  const envContent = `# Next-Lite Environment Variables

# Server configuration
PORT=3000
NEXT_LITE_SSR=false

# Application settings
NEXT_LITE_APP_NAME="${projectName}"
`;
  fs.writeFileSync(path.join(projectDir, '.env'), envContent);
  
  // Create .gitignore
  const gitignoreContent = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/dist/

# production
/build
/out

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env.local
.env.development.local
.env.test.local
.env.production.local
`;
  fs.writeFileSync(path.join(projectDir, '.gitignore'), gitignoreContent);
  
  // Create README.md
  const readmeContent = `# ${projectName}

This is a [Next-Lite](https://github.com/teckmill/next-lite-main) project.

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying \`pages/index.${ext}\`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next-Lite, take a look at the following resources:

- [Next-Lite Documentation](https://github.com/teckmill/next-lite-main) - learn about Next-Lite features and API.
- [Next-Lite Examples](https://github.com/teckmill/next-lite-main/tree/main/examples) - explore the Next-Lite examples.

## Deploy on Vercel

The easiest way to deploy your Next-Lite app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next-Lite deployment documentation](https://github.com/teckmill/next-lite-main) for more details.
`;
  fs.writeFileSync(path.join(projectDir, 'README.md'), readmeContent);
}

/**
 * Create package.json file
 * @param {string} projectDir - Project directory
 * @param {string} projectName - Project name
 */
function createPackageJson(projectDir, projectName) {
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next-lite dev',
      build: 'next-lite build',
      start: 'next-lite start',
      'build:static': 'next-lite build --static',
      'build:ssr': 'next-lite build --ssr'
    },
    dependencies: {
      'next-lite-framework': '^0.1.0',
      'react': '^18.3.1',
      'react-dom': '^18.3.1'
    },
    devDependencies: {
      '@types/react': '^18.3.18',
      '@types/react-dom': '^18.3.5',
      'typescript': '^5.7.3'
    }
  };
  
  // If not using TypeScript, remove TypeScript dependencies
  if (!useTypeScript) {
    delete packageJson.devDependencies['@types/react'];
    delete packageJson.devDependencies['@types/react-dom'];
    delete packageJson.devDependencies['typescript'];
  }
  
  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

/**
 * Create tsconfig.json file
 * @param {string} projectDir - Project directory
 */
function createTsConfig(projectDir) {
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
      incremental: true
    },
    include: ['**/*.ts', '**/*.tsx'],
    exclude: ['node_modules']
  };
  
  fs.writeFileSync(
    path.join(projectDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );
}

// Run the app creation process
createApp().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
