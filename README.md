# Next-Lite 🚀

A lightweight, high-performance alternative to Next.js that prioritizes speed and simplicity. Built with esbuild at its core, Next-Lite offers a streamlined development experience while maintaining the essential features modern web developers need.

## Why Next-Lite? 🤔

- **Blazing Fast** ⚡️ - Built on esbuild, offering build times up to 100x faster than traditional bundlers
- **Zero Config** 📦 - Start coding immediately with sensible defaults
- **Minimal Footprint** 🌱 - Small bundle sizes and minimal dependencies
- **Developer Friendly** 💻 - Great DX with hot module replacement and instant feedback

## Core Features 🎯

- ⚡️ **Lightning Fast Development**
  - Near-instant builds with esbuild
  - Hot Module Replacement (HMR) with state preservation
  - Enhanced error overlay for better debugging

- 🖥️ **Flexible Rendering Options**
  - Client-side rendering (CSR) by default
  - Server-side rendering (SSR) support
  - Static site generation for optimal performance

- 📁 **Intuitive File-Based Routing**
  - Automatic route generation based on your file structure
  - Dynamic routing support with parameters
  - API routes for backend functionality

- 🎨 **Modern Styling Solutions**
  - CSS Modules support out of the box
  - Global CSS support
  - Optimized CSS extraction in production

- 🔧 **Environment Configuration**
  - Support for .env files
  - Environment variables in both client and server
  - Runtime configuration options

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

# Build for production (client-side rendering)
npm run build

# Build with server-side rendering
npm run build -- --ssr

# Build as static site
npm run build -- --static

# Start production server
npm start

# Start with SSR enabled
npm start -- --ssr

# Clean build files
npm run clean
```

## Performance Comparison 📊

| Feature              | Next-Lite | Next.js |
|---------------------|-----------|---------|
| Dev Startup Time    | ~300ms    | ~3s     |
| Production Build    | ~2s       | ~20s    |
| Bundle Size (Base)  | ~80KB     | ~200KB  |
| Memory Usage (Dev)  | ~200MB    | ~500MB  |
| SSR Support         | ✅        | ✅      |
| Static Generation   | ✅        | ✅      |
| CSS Modules         | ✅        | ✅      |
| TypeScript Support  | ✅        | ✅      |

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
