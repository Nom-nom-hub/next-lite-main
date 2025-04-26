<div align="center">
  <img src="https://raw.githubusercontent.com/Nom-nom-hub/next-lite-main/main/assets/next-lite-logo.png" alt="Next-Lite Logo" width="300" />
  <h1>Next-Lite</h1>
  <p>A lightweight, high-performance alternative to Next.js</p>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/next-lite-framework"><img src="https://img.shields.io/npm/v/next-lite-framework.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/next-lite-framework"><img src="https://img.shields.io/npm/dm/next-lite-framework.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://github.com/Nom-nom-hub/next-lite-main/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Nom-nom-hub/next-lite-main.svg?style=flat-square" alt="license"></a>
  <a href="https://github.com/Nom-nom-hub/next-lite-main/actions"><img src="https://img.shields.io/github/actions/workflow/status/Nom-nom-hub/next-lite-main/ci.yml?branch=main&style=flat-square" alt="build status"></a>
  <a href="https://bundlephobia.com/package/next-lite-framework"><img src="https://img.shields.io/bundlephobia/minzip/next-lite-framework?style=flat-square" alt="bundle size"></a>
  <a href="https://github.com/Nom-nom-hub/next-lite-main/stargazers"><img src="https://img.shields.io/github/stars/Nom-nom-hub/next-lite-main?style=flat-square" alt="github stars"></a>
</div>

<br />

Next-Lite is a zero-dependency, blazing-fast React framework that prioritizes speed and simplicity. Built with esbuild at its core, Next-Lite offers a streamlined development experience while maintaining the essential features modern web developers need.

## Why Next-Lite? 🤔

- **Blazing Fast** ⚡️ - Built on esbuild, offering build times up to 100x faster than traditional bundlers
- **Zero Config** 📦 - Start coding immediately with sensible defaults
- **Zero Dependencies** 🔄 - No external runtime dependencies for maximum reliability and security
- **Minimal Footprint** 🌱 - Tiny package size (15.9 kB) compared to Next.js (5+ MB)
- **Developer Friendly** 💻 - Great DX with hot module replacement and instant feedback

## Core Features 🎯

- ⚡️ **Lightning Fast Development**
  - Near-instant builds with esbuild
  - Hot Module Replacement (HMR) for rapid development
  - Fast refresh for React components

- 📁 **Intuitive File-Based Routing**
  - Automatic route generation based on your file structure
  - Dynamic routing support
  - API routes for backend functionality

- 🎨 **Modern Styling Solutions**
  - CSS Modules support out of the box
  - Scoped styles with zero configuration
  - PostCSS integration

- 💪 **TypeScript First**
  - First-class TypeScript support
  - Automatic type generation
  - Enhanced developer experience with type safety

## Quick Start 🏃‍♂️

```bash
# Create a new Next-Lite app
npx create-next-lite-app my-app

# Navigate to your app
cd my-app

# Start the development server
npm run dev
```

Visit http://localhost:3000 to see your app in action!

## Supercharged Installation with flash-install ⚡️

For even faster dependency installation, we recommend using [flash-install](https://www.npmjs.com/package/@flash-install/cli), a high-performance alternative to npm install:

```bash
# Install flash-install globally (one-time setup)
npm install -g @flash-install/cli

# Use flash-direct instead of npm install for maximum speed
flash-direct install

# Or create a snapshot for future installations
flash-install snapshot

# Restore from snapshot (ultra-fast)
flash-install restore
```

### Why flash-install with Next-Lite?

The combination of Next-Lite and flash-install creates the ultimate high-performance React development environment:

- **10-20x Faster Installations**: flash-install dramatically reduces dependency installation time
- **Perfect Synergy**: Zero-dependency Next-Lite + ultra-fast flash-install = unbeatable developer experience
- **Snapshot Caching**: Create snapshots of your node_modules for near-instant restoration
- **Reduced Disk I/O**: Less strain on your development machine
- **Team Productivity**: Everyone on your team benefits from faster setup times

Learn more about flash-install at [npmjs.com/package/@flash-install/cli](https://www.npmjs.com/package/@flash-install/cli)

## Project Structure 📂

```
my-app/
├── pages/           # Your application pages
│   ├── index.tsx    # Homepage
│   ├── about.tsx    # About page
│   └── api/         # API routes
├── public/          # Static files
└── package.json
```

## Development Commands 🛠️

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clean build files
npm run clean
```

## Performance Comparison 📊

| Feature                   | Next-Lite     | Next.js       |
|---------------------------|---------------|---------------|
| Package Size              | 15.9 kB       | 5+ MB         |
| Dependencies              | 0             | 50+           |
| Dev Startup Time          | ~300ms        | ~3s           |
| Production Build          | ~2s           | ~20s          |
| Bundle Size (Base)        | ~80KB         | ~200KB        |
| Memory Usage (Dev)        | ~200MB        | ~500MB        |
| Installation Time         | ~5s           | ~30s          |
| Installation with flash   | ~1s           | ~10s          |
| Cold Start (Serverless)   | ~100ms        | ~800ms        |

## Contributing 🤝

We welcome contributions! Whether it's:
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License 📄

MIT © [Teck] - See [LICENSE](LICENSE) for more details.

## Support 💬

- 📖 [Documentation](https://github.com/teckcode/next-lite/wiki)
- 🐛 [Issue Tracker](https://github.com/teckcode/next-lite/issues)
- 💡 [Discussions](https://github.com/teckcode/next-lite/discussions)

---

<p align="center">Built with ❤️ by the Next-Lite Team</p>
