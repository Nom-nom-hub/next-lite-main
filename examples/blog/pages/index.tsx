import React from 'react';
import styles from './index.module.css';

interface Post {
  id: number;
  title: string;
  excerpt: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with Next-Lite',
    excerpt: 'Learn how to build modern web apps with Next-Lite, a lightweight alternative to Next.js.'
  },
  {
    id: 2,
    title: 'Building with Next-Lite',
    excerpt: 'Explore the features that make Next-Lite a great choice for your next project.'
  },
  {
    id: 3,
    title: 'Next-Lite vs Next.js',
    excerpt: 'A comparison of Next-Lite and Next.js, helping you choose the right tool for your needs.'
  }
];

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Next-Lite Blog</h1>
        <p>A simple blog built with Next-Lite</p>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {posts.map(post => (
            <article key={post.id} className={styles.card}>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <a href={`/posts/${post.id}`} className={styles.link}>
                Read more →
              </a>
            </article>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Built with ❤️ using Next-Lite</p>
      </footer>
    </div>
  );
}
