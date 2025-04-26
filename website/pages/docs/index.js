import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';
import Layout from '../../components/Layout';
import DocSidebar from '../../components/DocSidebar';
import styles from '../../styles/Docs.module.css';

export default function DocsIndex() {
  return (
    <Layout
      title="Documentation - Next-Lite Framework"
      description="Documentation for the Next-Lite framework, a lightweight, zero-dependency alternative to Next.js."
    >
      <div className={styles.docsContainer}>
        <div className={styles.sidebar}>
          <DocSidebar />
        </div>
        <div className={styles.content}>
          <header className={styles.docHeader}>
            <h1 className={styles.docTitle}>Next-Lite Documentation</h1>
            <p className={styles.docDescription}>
              Welcome to the Next-Lite documentation! This documentation will help you learn how to use Next-Lite to build fast, lightweight React applications.
            </p>
          </header>

          <section>
            <h2>Getting Started</h2>
            <p>
              Next-Lite is a lightweight, zero-dependency alternative to Next.js that prioritizes speed and simplicity. It provides a set of tools and conventions that make it easy to create production-ready applications.
            </p>
            <p>
              To get started with Next-Lite, check out the following guides:
            </p>
            <ul>
              <li>
                <Link href="/docs/introduction">
                  <a>Introduction to Next-Lite</a>
                </Link> - Learn about Next-Lite and its features
              </li>
              <li>
                <Link href="/docs/installation">
                  <a>Installation</a>
                </Link> - How to install Next-Lite
              </li>
              <li>
                <Link href="/docs/project-structure">
                  <a>Project Structure</a>
                </Link> - Understanding the Next-Lite project structure
              </li>
              <li>
                <Link href="/docs/quick-start">
                  <a>Quick Start</a>
                </Link> - Get up and running quickly
              </li>
            </ul>
          </section>

          <section>
            <h2>Guides</h2>
            <p>
              Once you're familiar with the basics, dive deeper into Next-Lite's features with these guides:
            </p>
            <ul>
              <li>
                <Link href="/docs/routing">
                  <a>Routing</a>
                </Link> - Learn about Next-Lite's file-based routing
              </li>
              <li>
                <Link href="/docs/pages">
                  <a>Pages</a>
                </Link> - Creating and using pages
              </li>
              <li>
                <Link href="/docs/data-fetching">
                  <a>Data Fetching</a>
                </Link> - Fetching data in Next-Lite
              </li>
              <li>
                <Link href="/docs/api-routes">
                  <a>API Routes</a>
                </Link> - Creating API endpoints
              </li>
              <li>
                <Link href="/docs/styling">
                  <a>Styling</a>
                </Link> - Styling your Next-Lite application
              </li>
              <li>
                <Link href="/docs/typescript">
                  <a>TypeScript</a>
                </Link> - Using TypeScript with Next-Lite
              </li>
              <li>
                <Link href="/docs/deployment">
                  <a>Deployment</a>
                </Link> - Deploying your Next-Lite application
              </li>
            </ul>
          </section>

          <section>
            <h2>API Reference</h2>
            <p>
              For detailed information about Next-Lite's API, check out these references:
            </p>
            <ul>
              <li>
                <Link href="/docs/api/cli">
                  <a>CLI</a>
                </Link> - Command-line interface reference
              </li>
              <li>
                <Link href="/docs/api/configuration">
                  <a>Configuration</a>
                </Link> - Configuration options
              </li>
              <li>
                <Link href="/docs/api/head">
                  <a>Head</a>
                </Link> - Head component for managing document head
              </li>
              <li>
                <Link href="/docs/api/link">
                  <a>Link</a>
                </Link> - Link component for client-side navigation
              </li>
              <li>
                <Link href="/docs/api/router">
                  <a>Router</a>
                </Link> - Router API
              </li>
              <li>
                <Link href="/docs/api/image">
                  <a>Image</a>
                </Link> - Image component for optimization
              </li>
              <li>
                <Link href="/docs/api/create-api-handler">
                  <a>createApiHandler</a>
                </Link> - API route handler
              </li>
            </ul>
          </section>

          <div className={styles.pagination}>
            <div className={styles.paginationLink}>
              {/* No previous link on the index page */}
            </div>
            <div className={styles.paginationLink + ' ' + styles.next}>
              <Link href="/docs/introduction">
                <a>
                  <div className={styles.paginationLabel}>Next</div>
                  <div className={styles.paginationTitle}>Introduction to Next-Lite</div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
