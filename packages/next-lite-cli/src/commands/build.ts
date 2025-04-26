import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';

interface BuildOptions {
  analyze: boolean;
}

export async function buildCommand(options: BuildOptions): Promise<void> {
  const spinner = ora('Building for production...').start();
  
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
    
    // Start build process
    const buildScript = path.resolve(process.cwd(), 'node_modules/next-lite-framework/scripts/build.js');
    
    if (!fs.existsSync(buildScript)) {
      spinner.fail('Build script not found. Please check your installation.');
      return;
    }
    
    // Set environment variables
    const env = {
      ...process.env,
      ANALYZE: options.analyze ? '1' : '0'
    };
    
    spinner.text = 'Building for production...';
    
    // Start the build
    const build = spawn('node', [buildScript], {
      stdio: 'inherit',
      env
    });
    
    await new Promise<void>((resolve, reject) => {
      build.on('close', (code) => {
        if (code === 0) {
          spinner.succeed('Production build completed successfully.');
          resolve();
        } else {
          spinner.fail(`Build failed with exit code ${code}.`);
          reject(new Error(`Build failed with exit code ${code}`));
        }
      });
    });
    
    // Show build stats
    const statsPath = path.resolve(process.cwd(), '.next/build-stats.json');
    if (fs.existsSync(statsPath)) {
      const stats = await fs.readJson(statsPath);
      
      console.log('\n' + chalk.bold('Build stats:'));
      console.log(`  Total size: ${chalk.cyan(formatBytes(stats.totalSize))}`);
      console.log(`  Page count: ${chalk.cyan(stats.pageCount)}`);
      console.log(`  Build time: ${chalk.cyan(stats.buildTime + 'ms')}`);
      
      if (options.analyze) {
        console.log('\nBundle analysis report generated at:');
        console.log(chalk.cyan('  .next/analyze/client.html'));
        console.log(chalk.cyan('  .next/analyze/server.html'));
      }
    }
    
    console.log('\n' + chalk.bold('Next steps:'));
    console.log(`  ${chalk.cyan('next-lite start')}`);
    console.log('');
    
  } catch (error) {
    spinner.fail('Failed to build for production.');
    console.error(error);
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
