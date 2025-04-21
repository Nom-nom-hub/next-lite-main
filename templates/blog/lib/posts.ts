// This is a simple in-memory data store for blog posts
// In a real app, you would fetch data from an API or database

const posts = [
  {
    id: '1',
    title: 'Getting Started with Next-Lite',
    excerpt: 'Learn how to build fast, modern web applications with Next-Lite.',
    date: 'June 1, 2023',
    content: `
      <p>Next-Lite is a lightweight alternative to Next.js that provides essential features for modern web development while maintaining a minimal footprint and blazing-fast build times.</p>
      
      <h2>Core Features</h2>
      <ul>
        <li>File-based routing</li>
        <li>Server-side rendering (SSR)</li>
        <li>Static site generation</li>
        <li>CSS Modules support</li>
        <li>API routes</li>
        <li>Environment variables</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>To create a new Next-Lite app, run:</p>
      <pre><code>npx create-next-lite-app my-app</code></pre>
      
      <p>Then, navigate to your app and start the development server:</p>
      <pre><code>cd my-app
npm run dev</code></pre>
    `,
  },
  {
    id: '2',
    title: 'Data Fetching in Next-Lite',
    excerpt: 'Learn about the different data fetching methods in Next-Lite.',
    date: 'June 15, 2023',
    content: `
      <p>Next-Lite provides several methods for fetching data:</p>
      
      <h2>getStaticProps</h2>
      <p>Use getStaticProps to fetch data at build time:</p>
      <pre><code>export async function getStaticProps() {
  const data = await fetchData();
  
  return {
    props: {
      data,
    },
  };
}</code></pre>
      
      <h2>getServerSideProps</h2>
      <p>Use getServerSideProps to fetch data on each request:</p>
      <pre><code>export async function getServerSideProps(context) {
  const data = await fetchData();
  
  return {
    props: {
      data,
    },
  };
}</code></pre>
      
      <h2>Client-side Fetching</h2>
      <p>You can also fetch data on the client side using React hooks:</p>
      <pre><code>import { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/data');
      const data = await response.json();
      setData(data);
    }
    
    fetchData();
  }, []);
  
  if (!data) return <div>Loading...</div>;
  
  return <div>{data.title}</div>;
}</code></pre>
    `,
  },
  {
    id: '3',
    title: 'Styling in Next-Lite',
    excerpt: 'Learn about the different styling options in Next-Lite.',
    date: 'July 1, 2023',
    content: `
      <p>Next-Lite provides several options for styling your application:</p>
      
      <h2>CSS Modules</h2>
      <p>CSS Modules are the recommended way to style your components in Next-Lite:</p>
      <pre><code>// Button.module.css
.button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
}

// Button.tsx
import styles from './Button.module.css';

export function Button({ children }) {
  return (
    <button className={styles.button}>
      {children}
    </button>
  );
}</code></pre>
      
      <h2>Global CSS</h2>
      <p>You can also use global CSS by importing it in your pages:</p>
      <pre><code>// pages/_app.tsx
import '../styles/global.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}</code></pre>
      
      <h2>CSS-in-JS</h2>
      <p>Next-Lite also supports CSS-in-JS libraries like styled-components and emotion.</p>
    `,
  },
];

export function getAllPosts() {
  return posts.map(({ id, title, excerpt, date }) => ({
    id,
    title,
    excerpt,
    date,
  }));
}

export function getPostById(id: string) {
  return posts.find(post => post.id === id);
}
