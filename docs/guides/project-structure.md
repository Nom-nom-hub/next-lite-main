# Next-Lite Project Structure

This guide explains the structure of a typical Next-Lite project and the purpose of each directory and file.

## Basic Project Structure

A basic Next-Lite project has the following structure:

```
my-app/
├── node_modules/
├── pages/
│   ├── _app.js
│   ├── index.js
│   └── api/
│       └── hello.js
├── public/
│   └── favicon.ico
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── components/
│   └── Button.js
├── package.json
└── next-lite.config.js (optional)
```

## Core Directories and Files

### `/pages`

The `pages` directory contains all the pages of your application. Each file in this directory becomes a route in your application based on its filename.

- `pages/index.js` - The home page (/)
- `pages/about.js` - The about page (/about)
- `pages/blog/[slug].js` - Dynamic blog post pages (/blog/post-1, /blog/post-2, etc.)

Special files in the `pages` directory:

- `_app.js` - Custom App component for global layouts and styles
- `_document.js` - Custom Document component for modifying the initial HTML and body tags

### `/pages/api`

The `pages/api` directory is used for API routes. Files in this directory are treated as API endpoints instead of pages.

- `pages/api/hello.js` - An API endpoint at /api/hello

### `/public`

The `public` directory contains static assets that are served at the root path.

- `public/favicon.ico` - The favicon for your site
- `public/images/logo.png` - An image at /images/logo.png

### `/styles`

The `styles` directory contains CSS files for styling your application.

- `styles/globals.css` - Global styles for your application
- `styles/Home.module.css` - CSS Modules for component-scoped styles

### `/components`

The `components` directory is not required by Next-Lite, but it's a common convention for organizing React components.

- `components/Button.js` - A reusable button component
- `components/Layout.js` - A layout component

### `package.json`

The `package.json` file contains metadata about your project and its dependencies.

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "scripts": {
    "dev": "next-lite dev",
    "build": "next-lite build",
    "start": "next-lite start"
  },
  "dependencies": {
    "next-lite-framework": "^0.3.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### `next-lite.config.js` (optional)

The `next-lite.config.js` file is an optional configuration file for customizing Next-Lite.

```js
module.exports = {
  // Configuration options
}
```

## TypeScript Project Structure

If you're using TypeScript, your project structure will be similar, but with TypeScript files:

```
my-app/
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   └── api/
│       └── hello.ts
├── components/
│   └── Button.tsx
├── types/
│   └── index.ts
├── tsconfig.json
└── next-env.d.ts
```

Additional TypeScript-specific files:

- `types/` - Directory for TypeScript type definitions
- `tsconfig.json` - TypeScript configuration
- `next-env.d.ts` - TypeScript declarations for Next-Lite

## Advanced Project Structure

For larger projects, you might want to organize your code further:

```
my-app/
├── pages/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── features/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── types/
│   └── lib/
├── tests/
└── ...
```

## Next Steps

- [Routing](./routing.md) - Learn about Next-Lite's file-based routing
- [Pages](./pages.md) - Creating and using pages
- [API Routes](./api-routes.md) - Creating API endpoints
