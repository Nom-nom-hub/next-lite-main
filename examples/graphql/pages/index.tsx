import React from 'react';
import { FilmList } from '../components/FilmList';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Next-Lite with GraphQL</h1>
        <p className={styles.description}>
          This example demonstrates how to integrate GraphQL with Next-Lite using Apollo Client.
        </p>
      </header>
      
      <main className={styles.main}>
        <FilmList />
      </main>
      
      <footer className={styles.footer}>
        <p>
          Powered by Next-Lite | Data from{' '}
          <a 
            href="https://graphql.org/swapi-graphql" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            SWAPI GraphQL API
          </a>
        </p>
      </footer>
    </div>
  );
}
