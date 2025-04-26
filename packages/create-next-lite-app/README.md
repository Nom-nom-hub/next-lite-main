# Create Next-Lite App

The easiest way to get started with Next-Lite is by using `create-next-lite-app`. This CLI tool enables you to quickly start building a new Next-Lite application, with everything set up for you.

## Usage

```bash
npx create-next-lite-app my-app
```

or

```bash
yarn create next-lite-app my-app
```

or

```bash
pnpm create next-lite-app my-app
```

## Options

`create-next-lite-app` comes with the following options:

- `--typescript` - Initialize as a TypeScript project
- `--use-npm` - Use npm as the package manager (default)
- `--use-yarn` - Use yarn as the package manager
- `--use-pnpm` - Use pnpm as the package manager
- `--use-flash` - Use flash-install as the package manager
- `--template <template-name>` - Specify a template for the created project
- `--example <example-name>` - Create project from an example in the Next-Lite repository
- `--skip-install` - Skip installing dependencies

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
