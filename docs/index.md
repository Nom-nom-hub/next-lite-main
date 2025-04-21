# Next-Lite Documentation

Welcome to the Next-Lite documentation! Next-Lite is a lightweight alternative to Next.js, focusing on speed and simplicity.

## Getting Started

### Installation

```bash
npm install next-lite-framework
```

### Create a New Project

```bash
npx create-next-lite-app my-app
cd my-app
npm run dev
```

## Core Concepts

### File-Based Routing

Next-Lite uses a file-based routing system similar to Next.js. Files in your `pages` directory automatically become routes.

```
pages/
├── index.tsx      # → /
├── about.tsx      # → /about
└── blog/
    ├── index.tsx  # → /blog
    └── [id].tsx   # → /blog/:id
```

### Server-Side Rendering (SSR)

Next-Lite supports server-side rendering for improved performance and SEO:

```bash
# Build with SSR support
npm run build -- --ssr

# Start the server with SSR enabled
npm start -- --ssr
```

See [Server-Side Rendering](./features.md#server-side-rendering-ssr) for more details.

### Static Site Generation

Generate a completely static site that can be deployed to any static hosting service:

```bash
# Generate a static export
npm run build -- --static
```

See [Static Site Generation](./features.md#static-site-generation) for more details.

### CSS Modules

Style your components using CSS Modules:

```tsx
// pages/index.tsx
import styles from './index.module.css';

export default function Home() {
  return <div className={styles.container}>Hello World</div>;
}
```

```css
/* index.module.css */
.container {
  padding: 2rem;
}
```

### API Routes

Create API endpoints by adding files to the `pages/api` directory:

```typescript
// pages/api/hello.ts
export default function handler(req, res) {
  res.json({ message: 'Hello from Next-Lite!' });
}
```

### Environment Variables

Next-Lite supports environment variables through `.env` files:

```
# .env
NEXT_LITE_API_URL=https://api.example.com
```

Access environment variables in your code:

```tsx
// pages/index.tsx
export default function Home() {
  return (
    <div>
      <p>API URL: {process.env.NEXT_LITE_API_URL}</p>
    </div>
  );
}
```

See [Environment Variables](./features.md#environment-variables) for more details.

## Configuration

### next-lite.config.js

Next-Lite provides a flexible configuration system through the `next-lite.config.js` file:

```javascript
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

  // Plugins
  plugins: [
    // Plugin objects
  ],

  // Middleware
  middleware: [
    // Middleware functions
  ],
}
```

See [Configuration](./configuration.md) for more details.

## Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (client-side rendering)
- `npm run build -- --ssr` - Build with server-side rendering
- `npm run build -- --static` - Build as static site
- `npm start` - Start production server
- `npm start -- --ssr` - Start with SSR enabled
- `npm test` - Run tests

### Hot Module Replacement (HMR)

Next-Lite includes HMR out of the box. Changes to your code will be reflected instantly without losing component state.

### Testing

Next-Lite includes built-in support for testing with Jest and React Testing Library:

```tsx
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

See [Testing](./testing.md) for more details.

## Advanced Features

### Advanced Routing

Next-Lite provides advanced routing features like route groups and middleware:

```
pages/
├── index.tsx
├── about.tsx
└── (auth)/              # Route group
    ├── _middleware.js   # Route-specific middleware
    ├── login.tsx        # → /login
    ├── register.tsx     # → /register
    └── profile.tsx      # → /profile
```

See [Advanced Routing](./routing.md) for more details.

### Data Fetching

Next-Lite provides data fetching utilities similar to Next.js:

```tsx
// Server-side rendering
export async function getServerSideProps(context) {
  const data = await fetchData();
  return { props: { data } };
}

// Static site generation
export async function getStaticProps() {
  const data = await fetchData();
  return { props: { data } };
}

// For dynamic routes
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: false,
  };
}
```

See [Data Fetching](./data-fetching.md) for more details.

### Image Optimization

Next-Lite includes an optimized Image component similar to Next.js's Image component:

```tsx
import { Image } from 'next-lite-framework/components';

export default function Home() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile picture"
      width={500}
      height={300}
      layout="responsive"
    />
  );
}
```

See [Image Optimization](./image-optimization.md) for more details.

### Internationalization (i18n)

Next-Lite supports internationalization for creating multilingual applications:

```tsx
import { useI18n } from 'next-lite-framework/i18n';

export default function Home() {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
}
```

See [Internationalization](./internationalization.md) for more details.

### Plugin System

Next-Lite includes a plugin system for extending the framework's functionality:

```js
// plugins/analytics.js
const { createPlugin } = require('next-lite/plugin-system');

module.exports = createPlugin({
  name: 'analytics',
  hooks: {
    afterRender: (html) => {
      return html.replace(
        '</body>',
        '<script>console.log("Analytics loaded")</script></body>'
      );
    },
  },
});
```

See [Plugins](./plugins.md) for more details.

### Middleware

Next-Lite supports middleware for processing requests:

```js
// middleware.js
module.exports = (req, res, next) => {
  console.log(`Request to ${req.url}`);
  next();
};
```

See [Middleware](./middleware.md) for more details.

## Deployment

### Static Export

Deploy your Next-Lite app as a static site to any static hosting service:

1. Build your app as a static site:
```bash
npm run build -- --static
```

2. Deploy the `dist/export` directory to your hosting service.

### Server Deployment

Deploy your Next-Lite app to any Node.js hosting platform:

1. Build your app:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### SSR Deployment

Deploy your Next-Lite app with server-side rendering:

1. Build your app with SSR support:
```bash
npm run build -- --ssr
```

2. Start the production server with SSR enabled:
```bash
npm start -- --ssr
```

## Examples

Check out our [example projects](https://github.com/teckmill/next-lite-main/tree/main/examples) for inspiration:

- Basic Blog
- Dashboard Template
- Todo App
- API Routes
- CSS Modules
- Environment Variables
- Internationalization (i18n)
- Image Optimization
- Server-Side Rendering
- Static Site Generation
- Testing
- Advanced Routing
- Data Fetching
- Plugins
- Middleware

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.
