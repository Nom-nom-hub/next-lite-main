import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Layout
      title="Next-Lite - A lightweight, zero-dependency alternative to Next.js"
      description="Next-Lite is a lightweight, zero-dependency alternative to Next.js that prioritizes speed and simplicity."
    >
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Next-Lite Framework</h1>
        <p className={styles.heroSubtitle}>
          A lightweight, zero-dependency alternative to Next.js that prioritizes speed and simplicity.
          Built with esbuild at its core, Next-Lite offers a streamlined development experience while
          maintaining the essential features modern web developers need.
        </p>
        <div className={styles.heroCta}>
          <Link href="/docs/introduction">
            <a className="btn btn-primary">Get Started</a>
          </Link>
          <a
            href="https://github.com/Nom-nom-hub/next-lite-main"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            GitHub
          </a>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>⚡️</div>
          <h2 className={styles.featureTitle}>Blazing Fast</h2>
          <p className={styles.featureDescription}>
            Built on esbuild, offering build times up to 100x faster than traditional bundlers.
            Get instant feedback during development.
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>📦</div>
          <h2 className={styles.featureTitle}>Zero Dependencies</h2>
          <p className={styles.featureDescription}>
            No external runtime dependencies for maximum reliability and security.
            Avoid dependency hell and reduce security vulnerabilities.
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>🌱</div>
          <h2 className={styles.featureTitle}>Minimal Footprint</h2>
          <p className={styles.featureDescription}>
            Tiny package size (15.9 kB) compared to Next.js (5+ MB).
            Smaller bundles mean faster load times and better performance.
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>💻</div>
          <h2 className={styles.featureTitle}>Developer Friendly</h2>
          <p className={styles.featureDescription}>
            Great developer experience with hot module replacement and instant feedback.
            Simple, intuitive API that's easy to learn and use.
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>🔄</div>
          <h2 className={styles.featureTitle}>Server-Side Rendering</h2>
          <p className={styles.featureDescription}>
            Support for server-side rendering (SSR) for improved SEO and performance.
            Get the benefits of static sites with the flexibility of dynamic content.
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>🖼️</div>
          <h2 className={styles.featureTitle}>Image Optimization</h2>
          <p className={styles.featureDescription}>
            Automatic image optimization for faster page loads and better user experience.
            Responsive images that look great on any device.
          </p>
        </div>
      </section>

      <section className={styles.comparison}>
        <h2 className={styles.comparisonTitle}>Next-Lite vs Next.js</h2>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Next-Lite</th>
              <th>Next.js</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Package Size</td>
              <td className={styles.highlight}>15.9 kB</td>
              <td>5+ MB</td>
            </tr>
            <tr>
              <td>Dependencies</td>
              <td className={styles.highlight}>0</td>
              <td>50+</td>
            </tr>
            <tr>
              <td>Dev Startup Time</td>
              <td className={styles.highlight}>~300ms</td>
              <td>~3s</td>
            </tr>
            <tr>
              <td>Production Build</td>
              <td className={styles.highlight}>~2s</td>
              <td>~20s</td>
            </tr>
            <tr>
              <td>Bundle Size (Base)</td>
              <td className={styles.highlight}>~80KB</td>
              <td>~200KB</td>
            </tr>
            <tr>
              <td>Memory Usage (Dev)</td>
              <td className={styles.highlight}>~200MB</td>
              <td>~500MB</td>
            </tr>
            <tr>
              <td>Installation Time</td>
              <td className={styles.highlight}>~5s</td>
              <td>~30s</td>
            </tr>
            <tr>
              <td>Installation with flash</td>
              <td className={styles.highlight}>~1s</td>
              <td>~10s</td>
            </tr>
            <tr>
              <td>Cold Start (Serverless)</td>
              <td className={styles.highlight}>~100ms</td>
              <td>~800ms</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
        <p className={styles.ctaDescription}>
          Start building faster, lighter React applications with Next-Lite today.
          Check out our documentation to learn more about Next-Lite and how to use it.
        </p>
        <Link href="/docs/introduction">
          <a className="btn btn-primary">Get Started</a>
        </Link>
      </section>
    </Layout>
  );
}
