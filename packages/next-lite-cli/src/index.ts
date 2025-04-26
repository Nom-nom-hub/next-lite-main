#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import ora from 'ora';
import { createProject } from './commands/create';
import { generateComponent } from './commands/generate';
import { devCommand } from './commands/dev';
import { buildCommand } from './commands/build';
import { startCommand } from './commands/start';

const program = new Command();

// Set up CLI metadata
program
  .name('next-lite')
  .description('Next-Lite framework CLI')
  .version('0.1.0');

// Create new project
program
  .command('create')
  .description('Create a new Next-Lite project')
  .argument('<project-name>', 'Name of the project')
  .option('-t, --template <template>', 'Template to use', 'default')
  .option('--ts, --typescript', 'Use TypeScript', false)
  .option('--use-npm', 'Use npm instead of yarn', false)
  .option('--skip-install', 'Skip package installation', false)
  .action(async (projectName, options) => {
    await createProject(projectName, options);
  });

// Generate components, pages, etc.
program
  .command('generate')
  .alias('g')
  .description('Generate components, pages, or API routes')
  .argument('<type>', 'Type of file to generate (component, page, api)')
  .argument('<name>', 'Name of the file to generate')
  .option('-d, --directory <directory>', 'Directory to create the file in')
  .option('--ts, --typescript', 'Use TypeScript', false)
  .action(async (type, name, options) => {
    await generateComponent(type, name, options);
  });

// Development server
program
  .command('dev')
  .description('Start the development server')
  .option('-p, --port <port>', 'Port to run the server on', '3000')
  .option('-H, --host <host>', 'Host to run the server on', 'localhost')
  .option('--no-open', 'Do not open the browser automatically')
  .action(async (options) => {
    await devCommand(options);
  });

// Build for production
program
  .command('build')
  .description('Build for production')
  .option('--analyze', 'Analyze the bundle size', false)
  .action(async (options) => {
    await buildCommand(options);
  });

// Start production server
program
  .command('start')
  .description('Start the production server')
  .option('-p, --port <port>', 'Port to run the server on', '3000')
  .option('-H, --host <host>', 'Host to run the server on', 'localhost')
  .action(async (options) => {
    await startCommand(options);
  });

// Parse arguments
program.parse();

// If no arguments, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
