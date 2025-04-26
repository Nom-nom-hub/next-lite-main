'use strict';

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { execSync } = require('child_process');

/**
 * Creates a new Next-Lite app
 */
async function createApp(options) {
  const { projectName, typescript, packageManager, template, example, skipInstall } = options;

  // Validate project name
  const root = path.resolve(projectName);
  const appName = path.basename(root);

  validateProjectName(appName);

  // Create project directory if it doesn't exist
  if (fs.existsSync(root)) {
    const existing = fs.readdirSync(root);
    if (existing.length > 0) {
      console.log();
      console.log(`The directory ${chalk.green(appName)} already exists and is not empty.`);

      const { proceed } = await inquirer.prompt({
        type: 'confirm',
        name: 'proceed',
        message: 'Do you want to continue and potentially overwrite files?',
        default: false,
      });

      if (!proceed) {
        process.exit(1);
      }
    }
  } else {
    fs.mkdirSync(root, { recursive: true });
  }

  console.log();
  console.log(`Creating a new Next-Lite app in ${chalk.green(root)}.`);
  console.log();

  // Determine the template source
  let templatePath;

  if (example) {
    // Use an example from the Next-Lite repository
    console.log(`Using example: ${chalk.cyan(example)}`);
    templatePath = await fetchExampleFromRepo(example);
  } else {
    // Use a local template
    const templateToUse = typescript ? `${template}-ts` : template;
    console.log(`Using template: ${chalk.cyan(templateToUse)}`);
    templatePath = path.resolve(__dirname, '../templates', templateToUse);

    if (!fs.existsSync(templatePath)) {
      console.log();
      console.log(`Template ${chalk.red(templateToUse)} not found.`);
      console.log(`Using default template instead.`);
      templatePath = path.resolve(__dirname, '../templates/default');
    }
  }

  // Copy template files to project directory
  const spinner = ora('Copying template files').start();
  try {
    await fs.copy(templatePath, root);
    spinner.succeed('Template files copied');
  } catch (error) {
    spinner.fail('Failed to copy template files');
    throw error;
  }

  // Create package.json
  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next-lite dev',
      build: 'next-lite build',
      start: 'next-lite start',
      lint: 'eslint .'
    },
    dependencies: {
      'next-lite-framework': '^1.0.0',
      'react': '^18.2.0',
      'react-dom': '^18.2.0'
    },
    devDependencies: {
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      'typescript': '^5.0.4',
      'eslint': '^8.40.0',
      'eslint-config-next': '^13.4.2'
    }
  };

  // Write package.json - fixed to not add extra newline
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create tsconfig.json if using TypeScript
  if (typescript) {
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
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
      exclude: ['node_modules']
    };

    fs.writeFileSync(
      path.join(root, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
  }

  // Install dependencies
  if (!skipInstall) {
    console.log();
    console.log('Installing dependencies:');

    const installSpinner = ora('Installing packages. This might take a few minutes.').start();

    try {
      const command = getInstallCommand(packageManager);
      execSync(command, { cwd: root, stdio: 'ignore' });
      installSpinner.succeed('Packages installed successfully');
    } catch (error) {
      installSpinner.fail('Failed to install packages');
      console.log();
      console.log(chalk.red('Failed to install packages. Try installing them manually.'));
      console.log();
      console.log(`  cd ${projectName}`);
      console.log(`  ${getInstallCommand(packageManager)}`);
    }
  }

  // Display success message
  console.log();
  console.log(`${chalk.green('Success!')} Created ${chalk.cyan(appName)} at ${chalk.cyan(root)}`);
  console.log();
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan('  npm run dev'));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan('  npm run build'));
  console.log('    Builds the app for production.');
  console.log();
  console.log(chalk.cyan('  npm start'));
  console.log('    Runs the built app in production mode.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), projectName);
  console.log(`  ${chalk.cyan('npm run dev')}`);
  console.log();
  console.log('Happy coding!');
}

/**
 * Validates the project name
 */
function validateProjectName(name) {
  if (!/^[a-z0-9-_]+$/i.test(name)) {
    console.log();
    console.error(
      `The project name ${chalk.red(name)} can only contain alphanumeric characters, hyphens, and underscores.`
    );
    process.exit(1);
  }

  if (name === 'next-lite' || name === 'next-lite-framework') {
    console.log();
    console.error(
      `The project name ${chalk.red(name)} is reserved. Please use a different name.`
    );
    process.exit(1);
  }
}

/**
 * Fetches an example from the Next-Lite repository
 */
async function fetchExampleFromRepo(example) {
  const tempDir = path.join(process.cwd(), '.next-lite-temp');

  // Clean up temp directory if it exists
  if (fs.existsSync(tempDir)) {
    fs.removeSync(tempDir);
  }

  // Create temp directory
  fs.mkdirSync(tempDir, { recursive: true });

  // Clone the example
  const spinner = ora('Downloading example').start();

  try {
    execSync(
      `npx degit Nom-nom-hub/next-lite-main/examples/${example} ${tempDir}`,
      { stdio: 'ignore' }
    );
    spinner.succeed('Example downloaded');
    return tempDir;
  } catch (error) {
    spinner.fail('Failed to download example');
    console.log();
    console.log(`Example ${chalk.red(example)} not found.`);
    process.exit(1);
  }
}

/**
 * Returns the install command for the selected package manager
 */
function getInstallCommand(packageManager) {
  switch (packageManager) {
    case 'yarn':
      return 'yarn';
    case 'pnpm':
      return 'pnpm install';
    case 'flash':
      return 'npx flash-direct install';
    default:
      return 'npm install';
  }
}

module.exports = createApp;
