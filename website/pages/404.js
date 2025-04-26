import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';
import Layout from '../components/Layout';
import styles from '../styles/404.module.css';

export default function NotFound() {
  return (
    <Layout
      title="404 - Page Not Found - Next-Lite Framework"
      description="The page you are looking for does not exist."
    >
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Page Not Found</h2>
        <p className={styles.description}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <a className="btn btn-primary">Go Home</a>
        </Link>
      </div>
    </Layout>
  );
}
