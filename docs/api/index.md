# API Reference

Welcome to the Next-Lite API Reference. This section provides detailed documentation for all components, hooks, and utilities in the Next-Lite framework.

## Core APIs

- [Router](./router.md) - Client-side navigation and routing
- [Data Fetching](./data-fetching.md) - Server-side rendering and static site generation
- [Image](./image.md) - Optimized image loading and rendering
- [Internationalization (i18n)](./i18n.md) - Multilingual support

## Configuration

- [Configuration](../configuration.md) - Configure your Next-Lite application
- [Environment Variables](../features.md#environment-variables) - Use environment variables in your application

## Advanced Features

- [Plugins](../plugins.md) - Extend the framework's functionality
- [Middleware](../middleware.md) - Process requests before they reach your route handlers

## CLI

The Next-Lite CLI provides commands for creating, developing, building, and deploying your application.

### Commands

| Command | Description |
|---------|-------------|
| `next-lite create <app-name>` | Create a new Next-Lite application |
| `next-lite dev` | Start the development server |
| `next-lite build` | Build your application for production |
| `next-lite start` | Start the production server |
| `next-lite analyze` | Analyze your application's bundle size |
| `next-lite lint` | Run the linter on your application |
| `next-lite test` | Run tests on your application |

### Options

| Option | Description |
|--------|-------------|
| `--help`, `-h` | Show help information |
| `--version`, `-v` | Show version information |
| `--ssr` | Enable server-side rendering |
| `--static` | Generate a static export |
| `--analyze` | Analyze bundle size |
| `--devtools` | Enable DevTools |

## DevTools

Next-Lite includes DevTools for debugging and profiling your application.

### Features

- **Event Logging**: Track events in your application
- **Performance Monitoring**: Monitor build, request, and render performance
- **Network Monitoring**: Track network requests
- **Configuration Viewer**: View your application's configuration

### Usage

Start the development server with the `--devtools` flag:

```bash
next-lite dev --devtools
```

Then open `http://localhost:3000/__devtools` in your browser.

## TypeScript Support

Next-Lite includes TypeScript definitions for all APIs. You can import types from the framework:

```typescript
import { RouterProps, LinkProps } from 'next-lite/router';
import { ImageProps } from 'next-lite/image';
import { I18nProviderProps } from 'next-lite/i18n';
```

## Examples

For examples of how to use these APIs, see the [examples directory](https://github.com/teckcode/next-lite/tree/main/examples) in the Next-Lite repository.
