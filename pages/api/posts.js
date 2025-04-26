// Sample blog posts data
const posts = [
  {
    id: 1,
    title: "Getting Started with Next-Lite",
    slug: "getting-started-with-next-lite",
    excerpt: "Learn how to build fast, lightweight websites with Next-Lite framework.",
    content: `
      # Getting Started with Next-Lite

      Next-Lite is a lightweight alternative to Next.js that focuses on speed and simplicity.
      
      ## Installation

      You can install Next-Lite using npm or yarn:
      
      \`\`\`bash
      npm install next-lite-framework
      # or
      yarn add next-lite-framework
      \`\`\`
      
      ## Creating Your First Page

      Create a file in the \`pages\` directory:
      
      \`\`\`jsx
      // pages/index.jsx
      export default function HomePage() {
        return <h1>Hello, Next-Lite!</h1>;
      }
      \`\`\`
      
      ## Running Your App

      Start the development server:
      
      \`\`\`bash
      npm run dev
      \`\`\`
      
      Visit http://localhost:3000 to see your app in action.
    `,
    author: "Jane Developer",
    date: "2025-04-15",
    tags: ["next-lite", "tutorial", "web development"]
  },
  {
    id: 2,
    title: "Building Fast Websites with esbuild",
    slug: "building-fast-websites-with-esbuild",
    excerpt: "Discover how esbuild can dramatically speed up your build times.",
    content: `
      # Building Fast Websites with esbuild

      esbuild is an extremely fast JavaScript bundler that can significantly improve your build times.
      
      ## Why esbuild?

      - **Speed**: esbuild is 10-100x faster than traditional bundlers
      - **Simplicity**: Easy to configure and use
      - **Modern**: Built with Go for maximum performance
      
      ## Using esbuild with Next-Lite

      Next-Lite uses esbuild under the hood, which is why it's so fast. You don't need to configure anything!
      
      ## Custom esbuild Configuration

      If you need to customize the esbuild configuration, you can do so in your Next-Lite config file:
      
      \`\`\`js
      // next-lite.config.js
      module.exports = {
        esbuild: {
          minify: true,
          target: ['es2020'],
          // other esbuild options
        }
      }
      \`\`\`
    `,
    author: "Alex Builder",
    date: "2025-04-18",
    tags: ["esbuild", "performance", "bundlers"]
  },
  {
    id: 3,
    title: "CSS Modules vs. Styled Components",
    slug: "css-modules-vs-styled-components",
    excerpt: "Compare different styling approaches for your Next-Lite projects.",
    content: `
      # CSS Modules vs. Styled Components

      When building React applications, you have several options for styling your components.
      
      ## CSS Modules

      CSS Modules allow you to write traditional CSS with local scope:
      
      \`\`\`css
      /* Button.module.css */
      .button {
        background-color: blue;
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
      }
      \`\`\`
      
      \`\`\`jsx
      import styles from './Button.module.css';
      
      function Button({ children }) {
        return <button className={styles.button}>{children}</button>;
      }
      \`\`\`
      
      ## Styled Components

      Styled Components let you write CSS directly in your JavaScript:
      
      \`\`\`jsx
      import styled from 'styled-components';
      
      const Button = styled.button\`
        background-color: blue;
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
      \`;
      
      function MyButton({ children }) {
        return <Button>{children}</Button>;
      }
      \`\`\`
      
      ## Which Should You Choose?

      - **CSS Modules**: Better for teams familiar with CSS, easier to migrate existing CSS
      - **Styled Components**: Better for dynamic styling based on props, no need for separate files
      
      Next-Lite works well with both approaches!
    `,
    author: "Sam Stylist",
    date: "2025-04-20",
    tags: ["css", "styling", "react"]
  },
  {
    id: 4,
    title: "Client-Side Routing in Next-Lite",
    slug: "client-side-routing-in-next-lite",
    excerpt: "Learn how to implement smooth client-side navigation in your Next-Lite apps.",
    content: `
      # Client-Side Routing in Next-Lite

      Next-Lite provides a simple but powerful routing system based on the file system.
      
      ## Basic Routing

      Create files in your \`pages\` directory to automatically create routes:
      
      - \`pages/index.jsx\` → \`/\`
      - \`pages/about.jsx\` → \`/about\`
      - \`pages/blog/index.jsx\` → \`/blog\`
      - \`pages/blog/[slug].jsx\` → \`/blog/:slug\`
      
      ## Client-Side Navigation

      Use the \`Link\` component to navigate between pages without a full page reload:
      
      \`\`\`jsx
      import { Link } from 'next-lite/router';
      
      function Navbar() {
        return (
          <nav>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
          </nav>
        );
      }
      \`\`\`
      
      ## Programmatic Navigation

      You can also navigate programmatically using the router:
      
      \`\`\`jsx
      import { useRouter } from 'next-lite/router';
      
      function LoginButton() {
        const router = useRouter();
        
        function handleLogin() {
          // Perform login logic
          router.push('/dashboard');
        }
        
        return <button onClick={handleLogin}>Log In</button>;
      }
      \`\`\`
    `,
    author: "Robin Router",
    date: "2025-04-22",
    tags: ["routing", "navigation", "next-lite"]
  },
  {
    id: 5,
    title: "State Management in React Applications",
    slug: "state-management-in-react-applications",
    excerpt: "Explore different state management solutions for your React and Next-Lite projects.",
    content: `
      # State Management in React Applications

      As your application grows, managing state becomes increasingly important.
      
      ## Local State with useState

      For simple components, React's built-in \`useState\` hook is often sufficient:
      
      \`\`\`jsx
      import { useState } from 'react';
      
      function Counter() {
        const [count, setCount] = useState(0);
        
        return (
          <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
          </div>
        );
      }
      \`\`\`
      
      ## Context API for Shared State

      When multiple components need access to the same state, use the Context API:
      
      \`\`\`jsx
      import { createContext, useContext, useState } from 'react';
      
      // Create context
      const ThemeContext = createContext();
      
      // Provider component
      function ThemeProvider({ children }) {
        const [theme, setTheme] = useState('light');
        
        return (
          <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
          </ThemeContext.Provider>
        );
      }
      
      // Consumer component
      function ThemeToggle() {
        const { theme, setTheme } = useContext(ThemeContext);
        
        return (
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Toggle Theme (Current: {theme})
          </button>
        );
      }
      \`\`\`
      
      ## External State Management Libraries

      For complex applications, consider using libraries like Redux, Zustand, or Jotai:
      
      \`\`\`jsx
      import create from 'zustand';
      
      // Create store
      const useStore = create(set => ({
        count: 0,
        increment: () => set(state => ({ count: state.count + 1 })),
        decrement: () => set(state => ({ count: state.count - 1 })),
      }));
      
      // Use in component
      function Counter() {
        const { count, increment, decrement } = useStore();
        
        return (
          <div>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
          </div>
        );
      }
      \`\`\`
    `,
    author: "Morgan State",
    date: "2025-04-25",
    tags: ["react", "state management", "hooks"]
  }
];

// API handler
module.exports = (req, res) => {
  const { method, query } = req;
  
  // GET all posts or filtered posts
  if (method === 'GET') {
    // If slug is provided, return a single post
    if (query.slug) {
      const post = posts.find(p => p.slug === query.slug);
      
      if (post) {
        return res.json(post);
      } else {
        return res.status(404).json({ error: 'Post not found' });
      }
    }
    
    // If tag is provided, filter posts by tag
    if (query.tag) {
      const filteredPosts = posts.filter(post => 
        post.tags.includes(query.tag)
      );
      
      return res.json(filteredPosts);
    }
    
    // Return all posts (with limited content)
    const simplifiedPosts = posts.map(({ id, title, slug, excerpt, author, date, tags }) => ({
      id, title, slug, excerpt, author, date, tags
    }));
    
    return res.json(simplifiedPosts);
  }
  
  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
};
