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

## Configuration

### next-lite.config.js

```javascript
module.exports = {
  // Configuration options (coming soon)
}
```

## Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Hot Module Replacement (HMR)

Next-Lite includes HMR out of the box. Changes to your code will be reflected instantly without losing component state.

## Deployment

### Static Export

Coming soon!

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

## Examples

Check out our [example projects](https://github.com/teckmill/next-lite-main/tree/main/examples) for inspiration:

- Basic Blog
- Todo App
- API Routes
- CSS Modules

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.
