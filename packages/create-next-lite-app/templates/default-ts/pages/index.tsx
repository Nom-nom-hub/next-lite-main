import Head from 'next-lite-framework/head';
import styles from '../styles/Home.module.css';
import { NextPage } from 'next-lite-framework/types';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next-Lite App</title>
        <meta name="description" content="Created with create-next-lite-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/Nom-nom-hub/next-lite-main">Next-Lite!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://github.com/Nom-nom-hub/next-lite-main/wiki" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next-Lite features and API.</p>
          </a>

          <a href="https://github.com/Nom-nom-hub/next-lite-main/tree/main/examples" className={styles.card}>
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy example Next-Lite projects.</p>
          </a>

          <a
            href="https://github.com/Nom-nom-hub/next-lite-main/blob/main/CONTRIBUTING.md"
            className={styles.card}
          >
            <h2>Contribute &rarr;</h2>
            <p>Learn about how to contribute to the Next-Lite project.</p>
          </a>

          <a
            href="https://github.com/Nom-nom-hub/next-lite-main"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next-Lite site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/Nom-nom-hub/next-lite-main"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            Next-Lite
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
