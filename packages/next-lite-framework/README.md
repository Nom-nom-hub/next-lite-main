# Next-Lite Framework

A lightweight, high-performance alternative to Next.js built with esbuild.

## Features

- **Fast Builds**: Uses esbuild for blazing-fast build times
- **Simple Architecture**: Easy to understand and customize
- **File-based Routing**: Intuitive routing based on your file structure
- **API Routes**: Built-in API route support
- **CSS Modules**: First-class support for CSS Modules
- **TypeScript Support**: Full TypeScript integration
- **Image Optimization**: Automatic image optimization
- **Data Fetching**: SWR-like data fetching utilities
- **Hot Module Replacement**: Fast refresh during development
- **Small Bundle Size**: Optimized for production

## Getting Started

### Installation

```bash
# Create a new Next-Lite project
npx create-next-lite my-app

# Or install in an existing project
npm install next-lite-framework
```

### Create a Page

Create a file in the `pages` directory:

```jsx
// pages/index.jsx
import React from 'react';
import { Head } from 'next-lite-framework';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Home | Next-Lite</title>
      </Head>
      <div>
        <h1>Welcome to Next-Lite!</h1>
        <p>A lightweight alternative to Next.js</p>
      </div>
    </>
  );
}
```

### Create an API Route

Create a file in the `pages/api` directory:

```js
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Next-Lite!' });
}
```

### Start Development Server

```bash
npx next-lite dev
```

### Build for Production

```bash
npx next-lite build
```

### Start Production Server

```bash
npx next-lite start
```

## Documentation

### Routing

Next-Lite uses file-based routing similar to Next.js:

- `pages/index.jsx` → `/`
- `pages/about.jsx` → `/about`
- `pages/blog/index.jsx` → `/blog`
- `pages/blog/[slug].jsx` → `/blog/:slug`

### Data Fetching

```jsx
import { useFetch, useSWR } from 'next-lite-framework';

// Basic data fetching
function Profile() {
  const { data, error, loading } = useFetch('/api/user');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>Hello {data.name}!</div>;
}

// SWR-like data fetching
function Dashboard() {
  const { data, error, loading, mutate } = useSWR('/api/dashboard', url => 
    fetch(url).then(res => res.json())
  );
  
  return (
    <div>
      <button onClick={() => mutate()}>Refresh</button>
      {/* ... */}
    </div>
  );
}
```

### API Routes

```js
// pages/api/user.js
export default function handler(req, res) {
  const { method } = req;
  
  switch (method) {
    case 'GET':
      res.status(200).json({ name: 'John Doe' });
      break;
    case 'POST':
      res.status(200).json({ message: 'User created' });
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}
```

### CSS Modules

```jsx
import styles from './Button.module.css';

function Button({ children }) {
  return (
    <button className={styles.button}>
      {children}
    </button>
  );
}
```

### Image Optimization

```jsx
import { Image } from 'next-lite-framework';

function Avatar() {
  return (
    <Image
      src="/avatar.png"
      alt="User Avatar"
      width={50}
      height={50}
      layout="responsive"
    />
  );
}
```

### Head Management

```jsx
import { Head } from 'next-lite-framework';

function Page() {
  return (
    <>
      <Head>
        <title>My Page</title>
        <meta name="description" content="Page description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Page content */}
    </>
  );
}
```

### Client-side Navigation

```jsx
import { Link, useRouter } from 'next-lite-framework';

function Navigation() {
  const router = useRouter();
  
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <button onClick={() => router.push('/contact')}>Contact</button>
    </nav>
  );
}
```

## Configuration

Create a `next-lite.config.js` file in your project root:

```js
module.exports = {
  server: {
    port: 3000,
    host: 'localhost'
  },
  build: {
    target: ['es2015'],
    minify: true,
    sourcemap: true,
    outDir: '.next'
  },
  images: {
    domains: ['example.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    path: '/_next/image',
    loader: 'default'
  },
  experimental: {
    ssr: false,
    concurrentFeatures: false,
    optimizeCss: false,
    scrollRestoration: false
  },
  env: {
    API_URL: 'https://api.example.com'
  }
};
```

## License

MIT
