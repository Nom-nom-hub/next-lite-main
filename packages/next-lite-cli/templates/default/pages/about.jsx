import React from 'react';
import styles from '../styles/Home.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>About</h1>
        
        <p className={styles.description}>
          This is the about page.
        </p>
        
        <div className={styles.grid}>
          <a href="/" className={styles.card}>
            <h2>&larr; Back Home</h2>
            <p>Return to the homepage.</p>
          </a>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <a href="https://github.com/next-lite/next-lite" target="_blank" rel="noopener noreferrer">
          Powered by Next-Lite
        </a>
      </footer>
    </div>
  );
}
