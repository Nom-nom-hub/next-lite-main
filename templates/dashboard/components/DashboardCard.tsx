import React from 'react';
import styles from '../styles/DashboardCard.module.css';

interface DashboardCardProps {
  label: string;
  value: string;
  change: string;
  icon: string;
}

export function DashboardCard({ label, value, change, icon }: DashboardCardProps) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.label}>{label}</h3>
        <p className={styles.value}>{value}</p>
        <p className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
          {change}
        </p>
      </div>
    </div>
  );
}
