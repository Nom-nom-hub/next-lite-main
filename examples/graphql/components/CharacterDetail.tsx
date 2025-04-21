import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PERSON } from '../lib/queries';
import { useRouter } from '../router';
import styles from './CharacterDetail.module.css';

interface CharacterDetailProps {
  id: string;
}

export function CharacterDetail({ id }: CharacterDetailProps) {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_PERSON, {
    variables: { id },
  });
  
  if (loading) {
    return <div className={styles.loading}>Loading character details...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>Error loading character: {error.message}</div>;
  }
  
  const person = data.person;
  
  if (!person) {
    return <div className={styles.notFound}>Character not found</div>;
  }
  
  return (
    <div className={styles.characterDetail}>
      <button 
        className={styles.backButton}
        onClick={() => router.navigate('/')}
      >
        ← Back to Films
      </button>
      
      <div className={styles.header}>
        <h1 className={styles.name}>{person.name}</h1>
      </div>
      
      <div className={styles.profile}>
        <div className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Birth Year:</span>
              <span className={styles.value}>{person.birthYear}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.label}>Gender:</span>
              <span className={styles.value}>{person.gender}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.label}>Height:</span>
              <span className={styles.value}>{person.height} cm</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.label}>Mass:</span>
              <span className={styles.value}>{person.mass} kg</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.label}>Eye Color:</span>
              <span className={styles.value}>{person.eyeColor}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.label}>Hair Color:</span>
              <span className={styles.value}>{person.hairColor}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.label}>Skin Color:</span>
              <span className={styles.value}>{person.skinColor}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.label}>Homeworld:</span>
              <span className={styles.value}>{person.homeworld?.name || 'Unknown'}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.label}>Species:</span>
              <span className={styles.value}>
                {person.species?.length > 0 
                  ? person.species.map(s => s.name).join(', ') 
                  : 'Human'}
              </span>
            </div>
          </div>
        </div>
        
        <div className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Appears In</h2>
          
          <ul className={styles.filmList}>
            {person.filmConnection.films.map((film) => (
              <li 
                key={film.id} 
                className={styles.filmItem}
                onClick={() => router.navigate(`/films/${film.id}`)}
              >
                {film.title}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Vehicles & Starships</h2>
          
          <div className={styles.vehiclesGrid}>
            <div className={styles.vehicleSection}>
              <h3 className={styles.vehicleTitle}>Starships</h3>
              {person.starshipConnection.starships.length > 0 ? (
                <ul className={styles.vehicleList}>
                  {person.starshipConnection.starships.map((starship) => (
                    <li key={starship.id} className={styles.vehicleItem}>
                      {starship.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyMessage}>No starships</p>
              )}
            </div>
            
            <div className={styles.vehicleSection}>
              <h3 className={styles.vehicleTitle}>Vehicles</h3>
              {person.vehicleConnection.vehicles.length > 0 ? (
                <ul className={styles.vehicleList}>
                  {person.vehicleConnection.vehicles.map((vehicle) => (
                    <li key={vehicle.id} className={styles.vehicleItem}>
                      {vehicle.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyMessage}>No vehicles</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
