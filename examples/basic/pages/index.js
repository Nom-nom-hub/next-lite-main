import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import Counter from '../components/Counter';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.container}>
      <Head>
        <title>Next-Lite Basic Example</title>
        <meta name="description" content="A basic example of Next-Lite framework" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/Nom-nom-hub/next-lite-main">Next-Lite!</a>
        </h1>

        <p className={styles.description}>
          This is a basic example showing core features of Next-Lite
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>State Management &rarr;</h2>
            <p>
              Current count: {count}
              <br />
              <button onClick={() => setCount(count + 1)}>Increment</button>
              <button onClick={() => setCount(count - 1)}>Decrement</button>
            </p>
          </div>

          <div className={styles.card}>
            <h2>Components &rarr;</h2>
            <Counter />
          </div>

          <Link href="/about" className={styles.card}>
            <h2>Navigation &rarr;</h2>
            <p>Click to navigate to the About page using client-side navigation.</p>
          </Link>

          <Link href="/api/hello" className={styles.card}>
            <h2>API Routes &rarr;</h2>
            <p>Click to see the response from an API route.</p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/Nom-nom-hub/next-lite-main"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Next-Lite
        </a>
      </footer>
    </div>
  );
}
