import React from 'react';
import { useRouter } from '../router';
import styles from './features.module.css';

const features = [
  {
    title: 'File-Based Routing',
    description: 'Automatic route creation based on your file structure in the pages directory. Simple and intuitive!'
  },
  {
    title: 'Hot Module Replacement',
    description: 'See your changes instantly with our fast HMR system, complete with a sleek loading overlay.'
  },
  {
    title: 'API Routes',
    description: 'Build your backend API right alongside your frontend code. Full support for REST APIs with automatic route handling.'
  },
  {
    title: 'CSS Modules',
    description: 'Scoped CSS with zero configuration. Keep your styles modular and conflict-free.'
  },
  {
    title: 'Production Builds',
    description: 'Optimized production builds with code splitting, minification, and efficient caching strategies.'
  },
  {
    title: 'TypeScript Support',
    description: 'First-class TypeScript support out of the box. Enjoy type safety and better developer experience.'
  }
];

export default function FeaturesPage() {
  const { navigate } = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Features</h1>

        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <h2 className={styles.featureTitle}>{feature.title}</h2>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.navigation}>
          <button onClick={() => navigate('/')} className={styles.button}>
            Back to Home
          </button>
          <button onClick={() => navigate('/todos')} className={styles.button}>
            Try Todo Demo
          </button>
        </div>
      </div>
    </div>
  );
}
