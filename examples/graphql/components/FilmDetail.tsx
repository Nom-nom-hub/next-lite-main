import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_FILM } from '../lib/queries';
import { useRouter } from '../router';
import styles from './FilmDetail.module.css';

interface FilmDetailProps {
  id: string;
}

export function FilmDetail({ id }: FilmDetailProps) {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_FILM, {
    variables: { id },
  });
  
  if (loading) {
    return <div className={styles.loading}>Loading film details...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>Error loading film: {error.message}</div>;
  }
  
  const film = data.film;
  
  if (!film) {
    return <div className={styles.notFound}>Film not found</div>;
  }
  
  return (
    <div className={styles.filmDetail}>
      <button 
        className={styles.backButton}
        onClick={() => router.navigate('/')}
      >
        ← Back to Films
      </button>
      
      <div className={styles.header}>
        <div className={styles.episode}>Episode {film.episodeID}</div>
        <h1 className={styles.title}>{film.title}</h1>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.label}>Director:</span> {film.director}
          </div>
          <div className={styles.metaItem}>
            <span className={styles.label}>Producers:</span> {film.producers.join(', ')}
          </div>
          <div className={styles.metaItem}>
            <span className={styles.label}>Release Date:</span> {film.releaseDate}
          </div>
        </div>
      </div>
      
      <div className={styles.crawl}>
        <div className={styles.crawlContent}>
          {film.openingCrawl}
        </div>
      </div>
      
      <div className={styles.sections}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Characters</h2>
          <ul className={styles.list}>
            {film.characters.map((character) => (
              <li 
                key={character.id} 
                className={styles.listItem}
                onClick={() => router.navigate(`/characters/${character.id}`)}
              >
                {character.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Planets</h2>
          <ul className={styles.list}>
            {film.planets.map((planet) => (
              <li key={planet.id} className={styles.listItem}>
                {planet.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Species</h2>
          <ul className={styles.list}>
            {film.species.map((species) => (
              <li key={species.id} className={styles.listItem}>
                {species.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Starships</h2>
          <ul className={styles.list}>
            {film.starships.map((starship) => (
              <li key={starship.id} className={styles.listItem}>
                {starship.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
