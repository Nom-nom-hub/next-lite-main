# Contributing to Next-Lite

First off, thank you for considering contributing to Next-Lite! It's people like you that make Next-Lite such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the JavaScript/TypeScript styleguide
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. Fork the repo
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run the tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/next-lite.git

# Navigate to the project
cd next-lite

# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Structure

```
next-lite/
├── example/          # Example application
├── scripts/         # Build and development scripts
├── docs/           # Documentation
└── tests/          # Test files
```

## Style Guide

### JavaScript/TypeScript

* Use 2 spaces for indentation
* Use semicolons
* Use meaningful variable names
* Add types for TypeScript files
* Use async/await over promises
* Use template literals over string concatenation

### CSS

* Use CSS Modules
* Follow BEM naming convention
* Use meaningful class names
* Keep selectors as simple as possible

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
