import React from 'react';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.highlight}>Next-Lite</span>
        </h1>
        
        <p className={styles.description}>
          Get started by editing <code>pages/index.jsx</code>
        </p>
        
        <div className={styles.grid}>
          <a href="https://github.com/next-lite/next-lite" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next-Lite features and API.</p>
          </a>
          
          <a href="https://github.com/next-lite/next-lite/tree/main/examples" className={styles.card}>
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy example Next-Lite projects.</p>
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
