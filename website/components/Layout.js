import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';
import { useRouter } from 'next-lite-framework/router';
import styles from '../styles/Layout.module.css';

export default function Layout({ children, title = 'Next-Lite Framework', description = 'A lightweight, zero-dependency alternative to Next.js' }) {
  const router = useRouter();
  const currentPath = router.pathname;

  const isActive = (path) => {
    return currentPath === path ? styles.active : '';
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/logo.png" alt="Next-Lite Logo" height="40" width="40" />
            <span>Next-Lite</span>
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li className={isActive('/')}>
              <Link href="/">Home</Link>
            </li>
            <li className={isActive('/docs') || currentPath.startsWith('/docs/')}>
              <Link href="/docs">Documentation</Link>
            </li>
            <li className={isActive('/examples') || currentPath.startsWith('/examples/')}>
              <Link href="/examples">Examples</Link>
            </li>
            <li className={isActive('/blog') || currentPath.startsWith('/blog/')}>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <a href="https://github.com/Nom-nom-hub/next-lite-main" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>Next-Lite Framework</h3>
            <p>A lightweight, zero-dependency alternative to Next.js</p>
          </div>
          <div className={styles.footerSection}>
            <h3>Links</h3>
            <ul>
              <li><Link href="/docs">Documentation</Link></li>
              <li><Link href="/examples">Examples</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><a href="https://github.com/Nom-nom-hub/next-lite-main" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h3>Community</h3>
            <ul>
              <li><a href="https://github.com/Nom-nom-hub/next-lite-main/issues" target="_blank" rel="noopener noreferrer">Issues</a></li>
              <li><a href="https://github.com/Nom-nom-hub/next-lite-main/discussions" target="_blank" rel="noopener noreferrer">Discussions</a></li>
              <li><a href="https://github.com/Nom-nom-hub/next-lite-main/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contributing</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Next-Lite Framework. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
