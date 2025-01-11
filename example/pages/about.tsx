import React from 'react';
import { useRouter } from '../router';
import styles from './about.module.css';

export default function AboutPage() {
  const { navigate } = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>About Next-Lite</h1>
        
        <p className={styles.description}>
          Next-Lite is a lightweight alternative to Next.js, perfect for developers who want a simpler,
          more transparent framework without sacrificing the core features that make Next.js great.
        </p>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Our Philosophy</h2>
          <p className={styles.text}>
            We believe that modern web development shouldn't be complex. Next-Lite provides a minimal,
            yet powerful foundation for building React applications with features like:
          </p>
          <ul className={styles.list}>
            <li>Zero-config TypeScript support</li>
            <li>Fast development with HMR</li>
            <li>Simple file-based routing</li>
            <li>Lightweight bundle size</li>
          </ul>
        </div>

        <button 
          onClick={() => navigate('/')}
          className={styles.button}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
