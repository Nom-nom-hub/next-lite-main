<div align="center">
  <img src="https://raw.githubusercontent.com/Nom-nom-hub/next-lite-main/main/assets/next-lite-logo.png" alt="Next-Lite Logo" width="200" />
  <h1>Create Next-Lite App</h1>
  <p>The easiest way to get started with Next-Lite</p>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/create-next-lite-app"><img src="https://img.shields.io/npm/v/create-next-lite-app.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/create-next-lite-app"><img src="https://img.shields.io/npm/dm/create-next-lite-app.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://github.com/Nom-nom-hub/next-lite-main/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Nom-nom-hub/next-lite-main.svg?style=flat-square" alt="license"></a>
</div>

<br />

`create-next-lite-app` is a CLI tool that enables you to quickly start building a new Next-Lite application, with everything set up for you. It provides an intuitive, interactive experience to create new projects with zero configuration needed.

## Usage

You can create a new Next-Lite app in several ways, depending on your preferred package manager:

### Using npx (recommended)

```bash
npx create-next-lite-app my-app
```

### Using yarn

```bash
yarn create next-lite-app my-app
```

### Using pnpm

```bash
pnpm create next-lite-app my-app
```

### Using flash-install (fastest installation)

```bash
# First install flash-install if you don't have it
npm install -g @flash-install/cli

# Then create your app with the --use-flash flag
npx create-next-lite-app my-app --use-flash
```

### Interactive Mode

Running the command without a project name launches interactive mode:

```bash
npx create-next-lite-app
```

This will guide you through the setup process with prompts for:
- Project name
- TypeScript support
- Package manager preference
- Template selection

## Options

`create-next-lite-app` comes with the following options:

| Option | Description |
|--------|-------------|
| `--typescript` | Initialize as a TypeScript project with proper tsconfig and type definitions |
| `--use-npm` | Use npm as the package manager (default) |
| `--use-yarn` | Use yarn as the package manager for faster installations |
| `--use-pnpm` | Use pnpm as the package manager for efficient disk space usage |
| `--use-flash` | Use flash-install for 10-20x faster dependency installation |
| `--template <name>` | Specify a template for the created project (default, minimal, etc.) |
| `--example <name>` | Create project from an example in the Next-Lite repository |
| `--skip-install` | Skip installing dependencies (useful for CI environments) |

### Examples

```bash
# Create a TypeScript project
npx create-next-lite-app my-app --typescript

# Create a project with yarn
npx create-next-lite-app my-app --use-yarn

# Create a project from an example
npx create-next-lite-app my-app --example with-tailwind

# Create a project with a specific template and skip installation
npx create-next-lite-app my-app --template minimal --skip-install
```

## Why use Create Next-Lite App?

`create-next-lite-app` allows you to create a new Next-Lite app within seconds. It includes a number of benefits:

- **Interactive Experience**: Running `npx create-next-lite-app` (with no arguments) launches an interactive experience that guides you through setting up a project.
- **Zero Dependencies**: Start with a zero-dependency framework that's blazing fast.
- **Offline Support**: Create Next-Lite App will automatically detect if you're offline and bootstrap your project using your local package cache.
- **Support for Examples**: Create a project from an example in the Next-Lite repository.
- **Tested**: The package is part of the Next-Lite monorepo and tested using the same integration test suite as Next-Lite itself, ensuring it works as expected with each release.

## Documentation

Visit [https://github.com/Nom-nom-hub/next-lite-main/wiki](https://github.com/Nom-nom-hub/next-lite-main/wiki) to view the full documentation.

## Contributing

We'd love your help improving `create-next-lite-app`! See our [contributing guide](https://github.com/Nom-nom-hub/next-lite-main/blob/main/CONTRIBUTING.md) to learn about our development process and how to propose bug fixes and improvements.
