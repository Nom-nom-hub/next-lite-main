import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import Counter from '../components/Counter';
import { NextPage } from 'next-lite-framework/types';
import { User } from '../types/user';

const Home: NextPage = () => {
  const [user, setUser] = useState<User>({
    name: 'Guest',
    role: 'visitor',
    isLoggedIn: false
  });

  const login = (): void => {
    setUser({
      name: 'John Doe',
      role: 'admin',
      isLoggedIn: true,
      lastLogin: new Date()
    });
  };

  const logout = (): void => {
    setUser({
      name: 'Guest',
      role: 'visitor',
      isLoggedIn: false
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Next-Lite TypeScript Example</title>
        <meta name="description" content="A TypeScript example of Next-Lite framework" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/Nom-nom-hub/next-lite-main">Next-Lite!</a>
        </h1>

        <p className={styles.description}>
          This is a TypeScript example showing type-safe Next-Lite features
        </p>

        <div className={styles.userInfo}>
          <h2>Current User</h2>
          <p>Name: {user.name}</p>
          <p>Role: {user.role}</p>
          <p>Status: {user.isLoggedIn ? 'Logged In' : 'Logged Out'}</p>
          {user.lastLogin && (
            <p>Last Login: {user.lastLogin.toLocaleString()}</p>
          )}
          <div>
            {user.isLoggedIn ? (
              <button onClick={logout}>Logout</button>
            ) : (
              <button onClick={login}>Login</button>
            )}
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>TypeScript Components &rarr;</h2>
            <Counter initialCount={5} />
          </div>

          <Link href="/users" className={styles.card}>
            <h2>Type-Safe Pages &rarr;</h2>
            <p>Visit a page with typed data fetching and props.</p>
          </Link>

          <Link href="/api/users" className={styles.card}>
            <h2>Typed API Routes &rarr;</h2>
            <p>See a type-safe API response with TypeScript interfaces.</p>
          </Link>

          <a
            href="https://github.com/Nom-nom-hub/next-lite-main/tree/main/examples/with-typescript"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>Source Code &rarr;</h2>
            <p>View the source code for this TypeScript example.</p>
          </a>
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
};

export default Home;
