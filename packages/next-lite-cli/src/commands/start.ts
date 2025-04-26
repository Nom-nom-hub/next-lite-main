import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';

interface StartOptions {
  port: string;
  host: string;
}

export async function startCommand(options: StartOptions): Promise<void> {
  const spinner = ora('Starting production server...').start();
  
  try {
    // Check if we're in a Next-Lite project
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      spinner.fail('No package.json found. Are you in a Next-Lite project?');
      return;
    }
    
    const packageJson = await fs.readJson(packageJsonPath);
    const hasNextLite = packageJson.dependencies && 
      (packageJson.dependencies['next-lite-framework'] || packageJson.dependencies['next-lite']);
    
    if (!hasNextLite) {
      spinner.fail('This doesn\'t appear to be a Next-Lite project.');
      return;
    }
    
    // Check if build exists
    const buildDir = path.resolve(process.cwd(), '.next');
    if (!fs.existsSync(buildDir)) {
      spinner.warn('No build directory found. Running build first...');
      
      // Run build command
      const buildScript = path.resolve(process.cwd(), 'node_modules/next-lite-framework/scripts/build.js');
      
      if (!fs.existsSync(buildScript)) {
        spinner.fail('Build script not found. Please check your installation.');
        return;
      }
      
      const build = spawn('node', [buildScript], {
        stdio: 'inherit'
      });
      
      await new Promise<void>((resolve, reject) => {
        build.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Build failed with exit code ${code}`));
          }
        });
      });
    }
    
    spinner.succeed('Build verified.');
    spinner.start('Starting production server...');
    
    // Start production server
    const startScript = path.resolve(process.cwd(), 'node_modules/next-lite-framework/scripts/start.js');
    
    if (!fs.existsSync(startScript)) {
      spinner.fail('Start script not found. Please check your installation.');
      return;
    }
    
    // Set environment variables
    const env = {
      ...process.env,
      PORT: options.port,
      HOST: options.host
    };
    
    // Start the server
    const server = spawn('node', [startScript], {
      stdio: 'inherit',
      env
    });
    
    spinner.succeed('Production server started.');
    
    // Handle server exit
    server.on('close', (code) => {
      if (code !== 0) {
        console.error(chalk.red(`Production server exited with code ${code}`));
        process.exit(code || 1);
      }
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      server.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      server.kill('SIGTERM');
    });
    
  } catch (error) {
    spinner.fail('Failed to start production server.');
    console.error(error);
  }
}
