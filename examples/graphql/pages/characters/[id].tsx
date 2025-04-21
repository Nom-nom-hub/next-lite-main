import React from 'react';
import { CharacterDetail } from '../../components/CharacterDetail';
import { useRouter } from '../../router';
import styles from '../../styles/Home.module.css';

export default function CharacterPage() {
  const router = useRouter();
  const { id } = router.params;
  
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <CharacterDetail id={id} />
      </main>
      
      <footer className={styles.footer}>
        <p>
          Powered by Next-Lite | Data from{' '}
          <a 
            href="https://graphql.org/swapi-graphql" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            SWAPI GraphQL API
          </a>
        </p>
      </footer>
    </div>
  );
}
