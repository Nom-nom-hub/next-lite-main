import React from 'react';
import styles from './LoadingOverlay.module.css';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export default function LoadingOverlay({ visible, message = 'Reloading...' }: LoadingOverlayProps) {
  return (
    <div className={`${styles.overlay} ${visible ? styles.visible : ''}`}>
      <div>
        <div className={styles.spinner} />
        <div className={styles.message}>{message}</div>
      </div>
    </div>
  );
}
