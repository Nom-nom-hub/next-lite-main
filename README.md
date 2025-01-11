# Next-Lite

A lightweight alternative to Next.js for building modern React applications. Next-Lite focuses on speed and simplicity while providing essential features for modern web development.

## Features

- ⚡️ **Lightning Fast Development** - Built on esbuild for near-instant builds
- 📁 **File-Based Routing** - Automatic route generation based on your file structure
- 🔥 **Hot Module Replacement** - See your changes instantly with HMR
- 🎨 **CSS Modules** - Scoped CSS with zero configuration
- 🚀 **API Routes** - Build your backend API alongside your frontend
- 📦 **Zero Config** - Start coding right away
- 💪 **TypeScript Support** - First-class TypeScript support out of the box

## Quick Start

```bash
# Create a new Next-Lite app
npx create-next-lite-app my-app

# Navigate to your app
cd my-app

# Start the development server
npm run dev
```

Visit http://localhost:3000 to see your app.

## Project Structure

```
my-app/
├── pages/           # Your application pages
│   ├── index.tsx    # Homepage
│   ├── about.tsx    # About page
│   └── api/         # API routes
├── public/          # Static files
└── package.json
```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Routes

Create API endpoints by adding files to the `pages/api` directory:

```typescript
// pages/api/hello.ts
export default function handler(req, res) {
  res.json({ message: 'Hello from Next-Lite!' });
}
```

## CSS Modules

Style your components with CSS Modules:

```typescript
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

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Your Name]
