import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';
import styles from '../styles/Home.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>About - Next-Lite Basic Example</title>
        <meta name="description" content="About page for Next-Lite basic example" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>About Next-Lite</h1>

        <p className={styles.description}>
          Next-Lite is a lightweight, zero-dependency alternative to Next.js
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Zero Dependencies &rarr;</h2>
            <p>
              Next-Lite has zero external runtime dependencies, making it lightweight and secure.
            </p>
          </div>

          <div className={styles.card}>
            <h2>Fast Builds &rarr;</h2>
            <p>
              Built with esbuild, Next-Lite offers build times up to 100x faster than traditional bundlers.
            </p>
          </div>

          <div className={styles.card}>
            <h2>Small Footprint &rarr;</h2>
            <p>
              At just 15.9 kB, Next-Lite is significantly smaller than Next.js (5+ MB).
            </p>
          </div>

          <div className={styles.card}>
            <h2>Developer Friendly &rarr;</h2>
            <p>
              Great developer experience with hot module replacement and instant feedback.
            </p>
          </div>
        </div>

        <div className={styles.backToHome}>
          <Link href="/">
            &larr; Back to home
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
