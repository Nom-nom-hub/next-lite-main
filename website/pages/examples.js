import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';
import Layout from '../components/Layout';
import styles from '../styles/Examples.module.css';

const examples = [
  {
    title: 'Basic Example',
    description: 'A simple example showcasing the core features of Next-Lite.',
    link: 'https://github.com/Nom-nom-hub/next-lite-main/tree/main/examples/basic',
    tags: ['Routing', 'Components', 'CSS Modules', 'API Routes']
  },
  {
    title: 'TypeScript Example',
    description: 'A TypeScript example demonstrating how to use Next-Lite with TypeScript.',
    link: 'https://github.com/Nom-nom-hub/next-lite-main/tree/main/examples/with-typescript',
    tags: ['TypeScript', 'Type-Safe API', 'Interfaces']
  },
  {
    title: 'API Routes Example',
    description: 'An example focused on building API routes with Next-Lite.',
    link: 'https://github.com/Nom-nom-hub/next-lite-main/tree/main/examples/with-api-routes',
    tags: ['API', 'REST', 'CORS', 'Middleware']
  },
  {
    title: 'CSS Modules Example',
    description: 'An example showcasing advanced CSS Modules usage.',
    link: 'https://github.com/Nom-nom-hub/next-lite-main/tree/main/examples/with-css-modules',
    tags: ['CSS Modules', 'Styling', 'Theming']
  },
  {
    title: 'Tailwind CSS Example',
    description: 'An example of integrating Tailwind CSS with Next-Lite.',
    link: 'https://github.com/Nom-nom-hub/next-lite-main/tree/main/examples/with-tailwind',
    tags: ['Tailwind CSS', 'JIT', 'Responsive']
  },
  {
    title: 'Server-Side Rendering Example',
    description: 'An example demonstrating server-side rendering with Next-Lite.',
    link: 'https://github.com/Nom-nom-hub/next-lite-main/tree/main/examples/with-ssr',
    tags: ['SSR', 'SEO', 'Performance']
  }
];

export default function Examples() {
  return (
    <Layout
      title="Examples - Next-Lite Framework"
      description="Example projects built with the Next-Lite framework."
    >
      <div className={styles.container}>
        <h1 className={styles.title}>Next-Lite Examples</h1>
        <p className={styles.description}>
          Explore example projects built with Next-Lite to learn how to use the framework in different scenarios.
        </p>

        <div className={styles.grid}>
          {examples.map((example, index) => (
            <a
              key={index}
              href={example.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <h2>{example.title}</h2>
              <p>{example.description}</p>
              <div className={styles.tags}>
                {example.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <div className={styles.contribute}>
          <h2>Want to Contribute?</h2>
          <p>
            We welcome contributions to our examples! If you've built something cool with Next-Lite,
            consider sharing it with the community.
          </p>
          <a
            href="https://github.com/Nom-nom-hub/next-lite-main/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Learn How to Contribute
          </a>
        </div>
      </div>
    </Layout>
  );
}
