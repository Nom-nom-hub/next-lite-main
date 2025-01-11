import React from 'react';
import { useRouter } from '../router';
import styles from './index.module.css';

export default function HomePage() {
  const { navigate } = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Next-Lite</h1>
        <p className={styles.description}>
          A lightweight alternative to Next.js for building modern React applications
        </p>
        
        <h2 className={styles.subtitle}>Features</h2>
        <ul className={styles.list}>
          <li>TypeScript & JSX Support</li>
          <li>Fast Development Server</li>
          <li>ES Modules for Modern Development</li>
          <li>Zero Configuration</li>
          <li>Hot Module Reloading</li>
          <li>API Routes</li>
          <li>CSS Modules</li>
        </ul>

        <div className={styles.codeBlock}>
          <code>
            npm create next-lite-app my-app
          </code>
        </div>

        <div className={styles.navigation}>
          <button onClick={() => navigate('/features')} className={styles.button}>
            Features
          </button>
          <button onClick={() => navigate('/about')} className={styles.button}>
            About
          </button>
          <button onClick={() => navigate('/docs')} className={styles.button}>
            Documentation
          </button>
          <button onClick={() => navigate('/todos')} className={styles.button}>
            Todo Demo
          </button>
        </div>

        <div className={styles.footer}>
          <a href="https://github.com/yourusername/next-lite" className={styles.link}>
            GitHub
          </a>
          <span className={styles.separator}>•</span>
          <a href="https://next-lite.dev" className={styles.link}>
            Documentation
          </a>
        </div>
      </div>
    </div>
  );
}
