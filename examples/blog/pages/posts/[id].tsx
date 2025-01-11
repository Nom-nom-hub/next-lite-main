import React from 'react';
import { useRouter } from '../../router';
import styles from './[id].module.css';

interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
}

const posts: Record<string, Post> = {
  '1': {
    id: 1,
    title: 'Getting Started with Next-Lite',
    content: `
      Next-Lite is a lightweight alternative to Next.js, designed for building modern React applications with minimal overhead.
      
      ## Features
      - TypeScript & JSX Support
      - Fast Development Server
      - ES Modules for Modern Development
      - Zero Configuration
      - Hot Module Reloading
      - CSS Modules
      
      ## Getting Started
      1. Create a new project:
         \`\`\`bash
         npm create next-lite-app my-app
         \`\`\`
      
      2. Start the development server:
         \`\`\`bash
         npm run dev
         \`\`\`
      
      3. Open http://localhost:3000 to see your app!
    `,
    date: 'Jan 11, 2025',
    author: 'Next-Lite Team'
  },
  '2': {
    id: 2,
    title: 'Building a Blog with Next-Lite',
    content: `
      In this guide, we'll walk through building a beautiful blog using Next-Lite and CSS Modules.
      
      ## Project Structure
      \`\`\`
      my-blog/
      ├── pages/
      │   ├── index.tsx
      │   └── posts/
      │       └── [id].tsx
      ├── styles/
      │   └── *.module.css
      └── package.json
      \`\`\`
      
      ## Routing
      Next-Lite supports both static and dynamic routes. For dynamic routes, use square brackets in the filename:
      \`pages/posts/[id].tsx\` will match paths like \`/posts/1\`, \`/posts/2\`, etc.
      
      ## Styling
      We use CSS Modules for scoped styling. This prevents class name collisions and makes our styles more maintainable.
    `,
    date: 'Jan 11, 2025',
    author: 'Next-Lite Team'
  },
  '3': {
    id: 3,
    title: 'CSS Modules in Next-Lite',
    content: `
      CSS Modules are a great way to write modular and maintainable CSS in your Next-Lite applications.
      
      ## Benefits
      - Locally scoped class names
      - No class name collisions
      - Better code organization
      - Type safety with TypeScript
      
      ## Example
      \`\`\`css
      /* styles.module.css */
      .container {
        max-width: 800px;
        margin: 0 auto;
      }
      
      .title {
        font-size: 2rem;
        color: #333;
      }
      \`\`\`
      
      \`\`\`tsx
      import styles from './styles.module.css';
      
      export default function MyComponent() {
        return (
          <div className={styles.container}>
            <h1 className={styles.title}>Hello, Next-Lite!</h1>
          </div>
        );
      }
      \`\`\`
    `,
    date: 'Jan 11, 2025',
    author: 'Next-Lite Team'
  },
  '4': {
    id: 4,
    title: 'Client-Side Routing',
    content: `
      Next-Lite provides a powerful client-side routing system that makes building single-page applications a breeze.
      
      ## Features
      - Dynamic routes with parameters
      - Programmatic navigation
      - Route matching
      - History management
      
      ## Example
      \`\`\`tsx
      import { useRouter } from '../router';
      
      export default function Navigation() {
        const { navigate } = useRouter();
        
        return (
          <button onClick={() => navigate('/posts/1')}>
            Read Post
          </button>
        );
      }
      \`\`\`
      
      ## Route Parameters
      Access route parameters using the \`useRouter\` hook:
      \`\`\`tsx
      const { params } = useRouter();
      const postId = params.id; // From /posts/[id]
      \`\`\`
    `,
    date: 'Jan 11, 2025',
    author: 'Next-Lite Team'
  }
};

export default function PostPage() {
  const { params, navigate } = useRouter();
  const post = posts[params.id];

  if (!post) {
    return (
      <div className={styles.error}>
        <h1>Post Not Found</h1>
        <p>The post you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ← Back to Posts
        </button>
        
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <div className={styles.date}>
                <svg className={styles.icon} viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {post.date}
              </div>
              <div className={styles.author}>
                <svg className={styles.icon} viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.author}
              </div>
            </div>
          </header>

          <div className={styles.markdown}>
            {post.content.split('\n').map((line, index) => {
              if (line.startsWith('##')) {
                return <h2 key={index}>{line.slice(3)}</h2>;
              }
              if (line.startsWith('#')) {
                return <h1 key={index}>{line.slice(2)}</h1>;
              }
              if (line.startsWith('```')) {
                return null;
              }
              if (line.trim() === '') {
                return <br key={index} />;
              }
              return <p key={index}>{line}</p>;
            })}
          </div>
        </article>
      </div>
    </div>
  );
}
