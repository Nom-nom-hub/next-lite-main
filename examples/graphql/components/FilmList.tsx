import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_FILMS } from '../lib/queries';
import { useRouter } from '../router';
import styles from './FilmList.module.css';

export function FilmList() {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_FILMS);
  
  if (loading) {
    return <div className={styles.loading}>Loading films...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>Error loading films: {error.message}</div>;
  }
  
  const films = data.allFilms.films;
  
  // Sort films by episode ID
  const sortedFilms = [...films].sort((a, b) => a.episodeID - b.episodeID);
  
  return (
    <div className={styles.filmList}>
      <h2 className={styles.title}>Star Wars Films</h2>
      
      <div className={styles.grid}>
        {sortedFilms.map((film) => (
          <div 
            key={film.id} 
            className={styles.card}
            onClick={() => router.navigate(`/films/${film.id}`)}
          >
            <div className={styles.episode}>Episode {film.episodeID}</div>
            <h3 className={styles.filmTitle}>{film.title}</h3>
            <div className={styles.details}>
              <div className={styles.detail}>
                <span className={styles.label}>Director:</span> {film.director}
              </div>
              <div className={styles.detail}>
                <span className={styles.label}>Released:</span> {film.releaseDate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
