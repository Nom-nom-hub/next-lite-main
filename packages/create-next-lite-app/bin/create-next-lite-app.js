#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const chalk = require('chalk');
const packageJson = require('../package.json');
const createApp = require('../lib/create-app');

let projectName;

// Set up the CLI
program
  .name(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(name => {
    projectName = name;
  })
  .option('--typescript', 'Initialize as a TypeScript project')
  .option('--use-npm', 'Use npm as the package manager (default)')
  .option('--use-yarn', 'Use yarn as the package manager')
  .option('--use-pnpm', 'Use pnpm as the package manager')
  .option('--use-flash', 'Use flash-install as the package manager')
  .option('--template <template-name>', 'Specify a template for the created project')
  .option('--example <example-name>', 'Create project from an example in the Next-Lite repository')
  .option('--skip-install', 'Skip installing dependencies')
  .allowUnknownOption()
  .on('--help', () => {
    console.log();
    console.log(`    Only ${chalk.green('<project-directory>')} is required.`);
    console.log();
    console.log('    If you have any problems, do not hesitate to file an issue:');
    console.log(`    ${chalk.cyan('https://github.com/Nom-nom-hub/next-lite-main/issues/new')}`);
    console.log();
  })
  .parse(process.argv);

const options = program.opts();

// Show help if no project name is provided
if (!projectName) {
  program.help();
  process.exit(1);
}

// Run the app creation
createApp({
  projectName,
  typescript: options.typescript,
  packageManager: options.useYarn ? 'yarn' : options.usePnpm ? 'pnpm' : options.useFlash ? 'flash' : 'npm',
  template: options.template || 'default',
  example: options.example,
  skipInstall: options.skipInstall
}).catch(reason => {
  console.log();
  console.log('Aborting installation.');
  if (reason.command) {
    console.log(`  ${chalk.cyan(reason.command)} has failed.`);
  } else {
    console.log(chalk.red('Unexpected error. Please report it as a bug:'));
    console.log(reason);
  }
  console.log();

  process.exit(1);
});
