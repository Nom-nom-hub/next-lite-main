import React from 'react';
import { useRouter } from '../router';
import styles from './docs.module.css';

export default function DocsPage() {
  const { navigate } = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Documentation</h1>
        <p className={styles.description}>
          Learn how to build modern web applications with Next-Lite
        </p>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Getting Started</h2>
          <p className={styles.text}>
            Create a new Next-Lite project with a single command:
          </p>
          <div className={styles.codeBlock}>
            <code>npx create-next-lite-app my-app</code>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Features</h2>
          <ul className={styles.list}>
            <li>TypeScript & JSX Support</li>
            <li>Fast Development Server with HMR</li>
            <li>CSS Modules Support</li>
            <li>Simple Client-side Routing</li>
            <li>Zero Configuration</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Project Structure</h2>
          <div className={styles.codeBlock}>
            <pre>
{`my-app/
├── example/
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── about.tsx
│   │   └── docs.tsx
│   ├── client.tsx
│   └── router.tsx
├── scripts/
│   └── dev.js
└── package.json`}
            </pre>
          </div>
        </div>

        <div className={styles.navigation}>
          <button onClick={() => navigate('/')} className={styles.button}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
