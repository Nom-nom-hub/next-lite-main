import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';

interface DevOptions {
  port: string;
  host: string;
  open: boolean;
}

export async function devCommand(options: DevOptions): Promise<void> {
  const spinner = ora('Starting development server...').start();
  
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
      spinner.warn('This doesn\'t appear to be a Next-Lite project.');
      spinner.info('Installing next-lite-framework...');
      
      // Install next-lite-framework
      const useYarn = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));
      const installCommand = useYarn ? 'yarn add' : 'npm install';
      
      try {
        const install = spawn(installCommand.split(' ')[0], [...installCommand.split(' ').slice(1), 'next-lite-framework'], {
          stdio: 'inherit',
          shell: true
        });
        
        await new Promise<void>((resolve, reject) => {
          install.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`Failed to install next-lite-framework (exit code: ${code})`));
            }
          });
        });
      } catch (error) {
        spinner.fail('Failed to install next-lite-framework.');
        console.error(error);
        return;
      }
    }
    
    spinner.succeed('Dependencies verified.');
    spinner.start('Starting development server...');
    
    // Start development server
    const devScript = path.resolve(process.cwd(), 'node_modules/next-lite-framework/scripts/dev.js');
    
    if (!fs.existsSync(devScript)) {
      spinner.fail('Development script not found. Please check your installation.');
      return;
    }
    
    // Set environment variables
    const env = {
      ...process.env,
      PORT: options.port,
      HOST: options.host,
      OPEN_BROWSER: options.open ? '1' : '0'
    };
    
    // Start the server
    const server = spawn('node', [devScript], {
      stdio: 'inherit',
      env
    });
    
    spinner.succeed('Development server started.');
    
    // Handle server exit
    server.on('close', (code) => {
      if (code !== 0) {
        console.error(chalk.red(`Development server exited with code ${code}`));
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
    spinner.fail('Failed to start development server.');
    console.error(error);
  }
}
