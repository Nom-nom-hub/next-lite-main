const path = require('path');
const { spawn } = require('child_process');

// Path to the next-lite-framework dev script
const devScriptPath = path.resolve(__dirname, '../node_modules/next-lite-framework/scripts/dev.js');
console.log('Dev script path:', devScriptPath);

// Run the dev script
const child = spawn('node', [devScriptPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PAGES_DIR: path.resolve(__dirname, 'pages'),
    PUBLIC_DIR: __dirname,
  }
});

child.on('error', (error) => {
  console.error('Failed to start dev server:', error);
  process.exit(1);
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`Dev server exited with code ${code}`);
    process.exit(code);
  }
});
