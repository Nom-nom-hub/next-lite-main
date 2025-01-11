import React from 'react';
import { useRouter } from '../router';
import styles from './index.module.css';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with Next-Lite',
    excerpt: 'Learn how to build modern React applications with Next-Lite, a lightweight alternative to Next.js.',
    date: 'Jan 11, 2025',
    author: 'Next-Lite Team'
  },
  {
    id: 2,
    title: 'Building a Blog with Next-Lite',
    excerpt: 'Step-by-step guide to creating a beautiful blog using Next-Lite and CSS Modules.',
    date: 'Jan 11, 2025',
    author: 'Next-Lite Team'
  },
  {
    id: 3,
    title: 'CSS Modules in Next-Lite',
    excerpt: 'Deep dive into using CSS Modules for scoped styling in your Next-Lite applications.',
    date: 'Jan 11, 2025',
    author: 'Next-Lite Team'
  },
  {
    id: 4,
    title: 'Client-Side Routing',
    excerpt: 'Explore the powerful client-side routing capabilities of Next-Lite.',
    date: 'Jan 11, 2025',
    author: 'Next-Lite Team'
  }
];

export default function HomePage() {
  const { navigate } = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Next-Lite Blog</h1>
          <p className={styles.subtitle}>
            A modern blog built with Next-Lite, showcasing its powerful features
          </p>
        </div>

        <div className={styles.grid}>
          {posts.map((post, index) => (
            <div key={post.id} className={styles.card} onClick={() => navigate(`/posts/${post.id}`)}>
              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.cardExcerpt}>{post.excerpt}</p>
              <div className={styles.cardMeta}>
                <div className={styles.cardDate}>
                  <svg className={styles.icon} viewBox="0 0 24 24">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {post.date}
                </div>
                <div className={styles.cardAuthor}>
                  <svg className={styles.icon} viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
