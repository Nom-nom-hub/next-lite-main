import Link from 'next-lite-framework/link';
import { useRouter } from 'next-lite-framework/router';
import styles from '../styles/DocSidebar.module.css';

export default function DocSidebar() {
  const router = useRouter();
  const currentPath = router.pathname;

  const isActive = (path) => {
    return currentPath === path ? styles.active : '';
  };

  const sections = [
    {
      title: 'Getting Started',
      items: [
        { title: 'Introduction', path: '/docs/introduction' },
        { title: 'Installation', path: '/docs/installation' },
        { title: 'Project Structure', path: '/docs/project-structure' },
        { title: 'Quick Start', path: '/docs/quick-start' }
      ]
    },
    {
      title: 'Guides',
      items: [
        { title: 'Routing', path: '/docs/routing' },
        { title: 'Pages', path: '/docs/pages' },
        { title: 'Data Fetching', path: '/docs/data-fetching' },
        { title: 'API Routes', path: '/docs/api-routes' },
        { title: 'Styling', path: '/docs/styling' },
        { title: 'TypeScript', path: '/docs/typescript' },
        { title: 'Deployment', path: '/docs/deployment' }
      ]
    },
    {
      title: 'API Reference',
      items: [
        { title: 'CLI', path: '/docs/api/cli' },
        { title: 'Configuration', path: '/docs/api/configuration' },
        { title: 'Head', path: '/docs/api/head' },
        { title: 'Link', path: '/docs/api/link' },
        { title: 'Router', path: '/docs/api/router' },
        { title: 'Image', path: '/docs/api/image' },
        { title: 'createApiHandler', path: '/docs/api/create-api-handler' }
      ]
    }
  ];

  return (
    <div className={styles.sidebar}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className={styles.section}>
          <h3 className={styles.sectionTitle}>{section.title}</h3>
          <ul className={styles.sectionItems}>
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className={`${styles.sectionItem} ${isActive(item.path)}`}>
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
