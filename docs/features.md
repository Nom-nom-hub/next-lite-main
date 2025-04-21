# Next-Lite Features

Next-Lite is a lightweight alternative to Next.js that provides essential features for modern web development while maintaining a minimal footprint and blazing-fast build times.

## Core Features

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

Next-Lite now supports server-side rendering for improved performance and SEO:

```bash
# Build with SSR support
npm run build -- --ssr

# Start the server with SSR enabled
npm start -- --ssr
```

You can also enable SSR in your `.env` file:

```
NEXT_LITE_SSR=true
```

### Static Site Generation

Generate a completely static site that can be deployed to any static hosting service:

```bash
# Generate a static export
npm run build -- --static
```

The static site will be generated in the `dist/export` directory.

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

All environment variables must be prefixed with `NEXT_LITE_` to be available in the browser.

### Hot Module Replacement (HMR)

Next-Lite includes HMR out of the box. Changes to your code will be reflected instantly without losing component state.

### TypeScript Support

Next-Lite has built-in TypeScript support. Just use `.tsx` and `.ts` files in your project.

## Developer Experience

### Enhanced Error Overlay

Next-Lite provides a detailed error overlay during development, making it easier to debug issues:

- Shows error message and stack trace
- Highlights the file and line where the error occurred
- Can be dismissed with the Escape key

### CLI for Project Creation

Create a new Next-Lite project with a single command:

```bash
npx create-next-lite-app my-app
```

The CLI provides options for:
- Selecting a template (basic, blog, dashboard, API)
- Using TypeScript
- Installing dependencies

## Performance

Next-Lite is built with performance in mind:

- Uses esbuild for blazing-fast builds (up to 100x faster than webpack)
- Minimal bundle sizes
- Optimized CSS extraction in production
- Code splitting for improved loading times

## Configuration

Next-Lite is designed to work with zero configuration, but you can customize it to suit your needs:

```javascript
// next-lite.config.js (coming soon)
module.exports = {
  // Configuration options
}
```
