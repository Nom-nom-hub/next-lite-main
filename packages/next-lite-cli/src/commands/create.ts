import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';

interface CreateOptions {
  template: string;
  typescript: boolean;
  useNpm: boolean;
  skipInstall: boolean;
}

export async function createProject(projectName: string, options: CreateOptions): Promise<void> {
  const spinner = ora('Creating project...').start();
  
  try {
    // Create project directory
    const projectDir = path.resolve(process.cwd(), projectName);
    
    // Check if directory already exists
    if (fs.existsSync(projectDir)) {
      spinner.fail(`Directory ${chalk.cyan(projectName)} already exists.`);
      return;
    }
    
    // Create directory
    fs.mkdirSync(projectDir, { recursive: true });
    
    // Copy template files
    const templateDir = path.resolve(__dirname, '../../templates', options.template);
    const templateExists = fs.existsSync(templateDir);
    
    if (!templateExists) {
      spinner.fail(`Template ${chalk.cyan(options.template)} not found.`);
      return;
    }
    
    // Copy template files
    await fs.copy(templateDir, projectDir);
    
    // Rename files based on TypeScript option
    if (options.typescript) {
      // Rename JS files to TS
      const jsFiles = await fs.readdir(path.join(projectDir, 'pages'));
      for (const file of jsFiles) {
        if (file.endsWith('.js')) {
          const newFile = file.replace('.js', '.ts');
          await fs.rename(
            path.join(projectDir, 'pages', file),
            path.join(projectDir, 'pages', newFile)
          );
        }
        if (file.endsWith('.jsx')) {
          const newFile = file.replace('.jsx', '.tsx');
          await fs.rename(
            path.join(projectDir, 'pages', file),
            path.join(projectDir, 'pages', newFile)
          );
        }
      }
      
      // Update package.json
      const packageJsonPath = path.join(projectDir, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        typescript: '^4.7.4',
        '@types/react': '^18.0.17',
        '@types/react-dom': '^18.0.6',
        '@types/node': '^18.7.13'
      };
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      
      // Create tsconfig.json
      const tsconfig = {
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
          baseUrl: '.',
          paths: {
            '@/*': ['./*']
          }
        },
        include: ['**/*.ts', '**/*.tsx'],
        exclude: ['node_modules']
      };
      await fs.writeJson(path.join(projectDir, 'tsconfig.json'), tsconfig, { spaces: 2 });
    }
    
    // Install dependencies
    if (!options.skipInstall) {
      spinner.text = 'Installing dependencies...';
      
      const packageManager = options.useNpm ? 'npm' : 'yarn';
      const installCommand = options.useNpm ? 'npm install' : 'yarn';
      
      try {
        execSync(installCommand, { cwd: projectDir, stdio: 'ignore' });
      } catch (error) {
        spinner.warn('Failed to install dependencies automatically.');
        spinner.info(`Please run ${chalk.cyan(`cd ${projectName} && ${installCommand}`)} to install dependencies manually.`);
      }
    }
    
    spinner.succeed(`Project ${chalk.green(projectName)} created successfully!`);
    
    // Show next steps
    console.log('\n' + chalk.bold('Next steps:'));
    console.log(`  cd ${chalk.cyan(projectName)}`);
    
    if (options.skipInstall) {
      console.log(`  ${chalk.cyan(options.useNpm ? 'npm install' : 'yarn')}`);
    }
    
    console.log(`  ${chalk.cyan(options.useNpm ? 'npm run dev' : 'yarn dev')}`);
    console.log('\nHappy coding! 🚀\n');
    
  } catch (error) {
    spinner.fail('Failed to create project.');
    console.error(error);
  }
}
