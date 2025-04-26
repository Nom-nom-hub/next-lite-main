import { useEffect, useState } from 'react';
import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';
import Layout from '../../components/Layout';
import DocSidebar from '../../components/DocSidebar';
import Markdown from '../../components/Markdown';
import styles from '../../styles/Docs.module.css';

// This would normally be fetched from a markdown file or API
const markdownContent = `# Introduction to Next-Lite

Next-Lite is a lightweight, zero-dependency alternative to Next.js that prioritizes speed and simplicity. It provides a set of tools and conventions that make it easy to create production-ready applications.

## What is Next-Lite?

Next-Lite is a React framework that enables you to build fast, modern web applications with React. It provides a set of tools and conventions that make it easy to create production-ready applications.

Key features of Next-Lite include:

- **Zero Dependencies**: No external runtime dependencies for maximum reliability and security
- **Blazing Fast**: Built on esbuild, offering build times up to 100x faster than traditional bundlers
- **Minimal Footprint**: Tiny package size (15.9 kB) compared to Next.js (5+ MB)
- **File-Based Routing**: Intuitive routing based on your file structure
- **API Routes**: Create backend functionality within your Next-Lite application
- **CSS Modules**: Built-in support for component-scoped styles
- **TypeScript Support**: First-class TypeScript support out of the box
- **Server-Side Rendering**: Support for server-side rendering (SSR) for improved SEO and performance
- **Image Optimization**: Automatic image optimization for faster page loads

## Why Choose Next-Lite?

Next-Lite is designed for developers who want:

1. **Speed**: Faster builds, faster development cycles, and faster runtime performance
2. **Simplicity**: A framework that's easy to understand and reason about
3. **Reliability**: Fewer dependencies mean fewer potential issues
4. **Control**: More direct access to the underlying React mechanisms
5. **Lightweight**: A smaller footprint for better performance and lower resource usage

## Next-Lite vs Next.js

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

## Philosophy

Next-Lite follows these core principles:

1. **Simplicity Over Complexity**: We prioritize simple, understandable solutions over complex ones
2. **Performance First**: Performance is a feature, not an afterthought
3. **Minimal Dependencies**: We avoid dependencies whenever possible
4. **Developer Experience**: We strive for a great developer experience
5. **Compatibility**: We aim to be compatible with the React ecosystem

## Getting Started

To get started with Next-Lite, check out the [Installation](/docs/installation) guide.

\`\`\`bash
# Create a new Next-Lite app
npx create-next-lite-app my-app

# Navigate to your app
cd my-app

# Start the development server
npm run dev
\`\`\`

Once you have your app running, you can start building your application by creating pages in the \`pages\` directory.

\`\`\`jsx
// pages/index.js
import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>My Next-Lite App</title>
        <meta name="description" content="My Next-Lite App" />
      </Head>

      <main>
        <h1>Welcome to Next-Lite!</h1>
        <p>Get started by editing pages/index.js</p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </main>
    </div>
  );
}
\`\`\`

## Next Steps

- [Installation](/docs/installation) - Learn how to install Next-Lite
- [Project Structure](/docs/project-structure) - Understanding the Next-Lite project structure
- [Quick Start](/docs/quick-start) - Get up and running quickly
`;

export default function Introduction() {
  return (
    <Layout
      title="Introduction - Next-Lite Framework"
      description="Introduction to the Next-Lite framework, a lightweight, zero-dependency alternative to Next.js."
    >
      <div className={styles.docsContainer}>
        <div className={styles.sidebar}>
          <DocSidebar />
        </div>
        <div className={styles.content}>
          <Markdown content={markdownContent} />
          
          <div className={styles.pagination}>
            <div className={styles.paginationLink + ' ' + styles.prev}>
              <Link href="/docs">
                <a>
                  <div className={styles.paginationLabel}>Previous</div>
                  <div className={styles.paginationTitle}>Documentation</div>
                </a>
              </Link>
            </div>
            <div className={styles.paginationLink + ' ' + styles.next}>
              <Link href="/docs/installation">
                <a>
                  <div className={styles.paginationLabel}>Next</div>
                  <div className={styles.paginationTitle}>Installation</div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
