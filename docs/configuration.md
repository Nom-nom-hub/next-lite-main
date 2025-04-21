# Configuration in Next-Lite

Next-Lite provides a flexible configuration system through the `next-lite.config.js` file, allowing you to customize various aspects of your application.

## Basic Configuration

Create a `next-lite.config.js` file in the root of your project:

```js
module.exports = {
  // Server configuration
  server: {
    port: 3000,
    host: 'localhost',
  },
  
  // Build configuration
  build: {
    target: 'es2015',
    minify: true,
    sourcemap: true,
    outDir: 'dist',
  },
  
  // Rendering options
  rendering: {
    ssr: false,
    staticExport: false,
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'custom-value',
  },
};
```

## Configuration Options

### Server Configuration

```js
server: {
  // Port to run the server on
  port: 3000,
  
  // Host to bind the server to
  host: 'localhost',
}
```

### Build Configuration

```js
build: {
  // ECMAScript target
  target: 'es2015', // 'es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020'
  
  // Whether to minify the output
  minify: true,
  
  // Whether to generate sourcemaps
  sourcemap: true,
  
  // Output directory
  outDir: 'dist',
}
```

### Rendering Options

```js
rendering: {
  // Whether to enable server-side rendering
  ssr: false,
  
  // Whether to generate a static export
  staticExport: false,
}
```

### Image Optimization

```js
images: {
  // Domains to allow for external images
  domains: ['example.com', 'images.unsplash.com'],
  
  // Device sizes for responsive images
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  
  // Image sizes for responsive images
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  
  // Image formats to support
  formats: ['image/webp'],
  
  // Minimum cache TTL in seconds
  minimumCacheTTL: 60,
  
  // Whether to allow SVG images
  dangerouslyAllowSVG: false,
}
```

### Internationalization

```js
i18n: {
  // Supported locales
  locales: ['en', 'fr', 'es'],
  
  // Default locale
  defaultLocale: 'en',
}
```

### Environment Variables

```js
env: {
  // Custom environment variables
  CUSTOM_KEY: 'custom-value',
  API_URL: 'https://api.example.com',
}
```

These variables will be available in your code as `process.env.CUSTOM_KEY` and `process.env.API_URL`.

### Plugins

```js
plugins: [
  // Plugin objects
  {
    name: 'my-plugin',
    hooks: {
      beforeBuild: (config) => {
        // Modify build configuration
        return config;
      },
    },
  },
]
```

See the [Plugins documentation](./plugins.md) for more details.

### Middleware

```js
middleware: [
  // Middleware functions
  (req, res, next) => {
    // Middleware logic
    next();
  },
]
```

See the [Middleware documentation](./middleware.md) for more details.

## Using Environment Variables

Next-Lite supports environment variables through `.env` files and the `env` option in the configuration file.

### .env Files

Create a `.env` file in the root of your project:

```
NEXT_LITE_API_URL=https://api.example.com
NEXT_LITE_DEBUG=true
```

Variables prefixed with `NEXT_LITE_` will be available in your code as `process.env.NEXT_LITE_API_URL` and `process.env.NEXT_LITE_DEBUG`.

### Configuration File

You can also define environment variables in the configuration file:

```js
module.exports = {
  env: {
    API_URL: 'https://api.example.com',
    DEBUG: true,
  },
};
```

These variables will be available in your code as `process.env.API_URL` and `process.env.DEBUG`.

## Command Line Overrides

You can override configuration options using command line arguments:

```bash
# Enable SSR
npm run build -- --ssr

# Generate static export
npm run build -- --static

# Disable minification
npm run build -- --no-minify

# Disable sourcemaps
npm run build -- --no-sourcemap
```

## TypeScript Support

For TypeScript users, you can create a `next-lite.config.ts` file:

```ts
import { NextLiteConfig } from 'next-lite';

const config: NextLiteConfig = {
  server: {
    port: 3000,
    host: 'localhost',
  },
  // Other options...
};

export default config;
```
