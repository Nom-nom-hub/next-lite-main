import React from 'react';
import styles from './post.module.css';

interface Post {
  id: number;
  title: string;
  content: string;
}

const posts: Record<number, Post> = {
  1: {
    id: 1,
    title: 'Getting Started with Next-Lite',
    content: `
      Next-Lite is a lightweight alternative to Next.js that focuses on speed and simplicity. 
      It provides essential features like file-based routing, HMR, and CSS Modules while maintaining 
      a minimal footprint.

      ## Quick Start

      1. Create a new Next-Lite app:
      \`\`\`bash
      npx create-next-lite-app my-app
      \`\`\`

      2. Navigate to your app directory:
      \`\`\`bash
      cd my-app
      \`\`\`

      3. Start the development server:
      \`\`\`bash
      npm run dev
      \`\`\`

      Visit http://localhost:3000 to see your app in action!
    `
  },
  2: {
    id: 2,
    title: 'Building with Next-Lite',
    content: `
      Next-Lite provides several features that make it a great choice for building modern web applications:

      ## File-Based Routing

      Create pages by adding files to your \`pages\` directory:
      \`\`\`
      pages/
      ├── index.tsx      # → /
      ├── about.tsx      # → /about
      └── blog/
          ├── index.tsx  # → /blog
          └── [id].tsx   # → /blog/:id
      \`\`\`

      ## CSS Modules

      Style your components using CSS Modules:
      \`\`\`tsx
      import styles from './styles.module.css';

      export default function Component() {
        return <div className={styles.container}>Hello World</div>;
      }
      \`\`\`

      ## API Routes

      Create API endpoints by adding files to \`pages/api\`:
      \`\`\`typescript
      // pages/api/hello.ts
      export default function handler(req, res) {
        res.json({ message: 'Hello from Next-Lite!' });
      }
      \`\`\`
    `
  },
  3: {
    id: 3,
    title: 'Next-Lite vs Next.js',
    content: `
      While Next.js is a fantastic framework, Next-Lite offers some unique advantages:

      ## Advantages of Next-Lite

      1. **Faster Development**
         - Built on esbuild for near-instant builds
         - Minimal configuration required
         - Faster hot module replacement

      2. **Smaller Bundle Size**
         - Minimal dependencies
         - Optimized production builds
         - Smaller runtime footprint

      3. **Simpler Architecture**
         - Easy to understand codebase
         - Fewer abstractions
         - More predictable behavior

      4. **Better Performance**
         - Faster page loads
         - Lower memory usage
         - Efficient routing system

      Choose Next-Lite when you need a lightweight, fast, and simple solution for your React applications.
    `
  }
};

export default function Post() {
  const [post, setPost] = React.useState<Post | null>(null);

  React.useEffect(() => {
    const id = parseInt(window.location.pathname.split('/posts/')[1]);
    setPost(posts[id] || null);
  }, []);

  if (!post) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Post not found</div>
        <a href="/" className={styles.backLink}>← Back to Home</a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <h1>{post.title}</h1>
        <div className={styles.content}>
          {post.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) {
              return <h2 key={i}>{line.slice(3)}</h2>;
            }
            if (line.startsWith('```')) {
              return null;
            }
            if (line.trim() === '') {
              return <br key={i} />;
            }
            return <p key={i}>{line}</p>;
          })}
        </div>
      </article>
      <a href="/" className={styles.backLink}>← Back to Home</a>
    </div>
  );
}
