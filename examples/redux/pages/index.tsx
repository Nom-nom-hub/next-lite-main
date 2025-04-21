import React from 'react';
import { Counter } from '../components/Counter';
import { TodoList } from '../components/TodoList';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Next-Lite with Redux</h1>
        <p className={styles.description}>
          This example demonstrates how to integrate Redux with Next-Lite.
        </p>
      </header>
      
      <main className={styles.main}>
        <Counter />
        <TodoList />
      </main>
      
      <footer className={styles.footer}>
        <p>Powered by Next-Lite</p>
      </footer>
    </div>
  );
}
