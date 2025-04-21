import React from 'react';
import { useRouter } from '../router';
import { Layout } from '../components/Layout';
import { DashboardCard } from '../components/DashboardCard';
import { Chart } from '../components/Chart';
import styles from '../styles/Dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  
  // Sample data for the dashboard
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: '👥' },
    { label: 'Revenue', value: '$12,345', change: '+8%', icon: '💰' },
    { label: 'Active Sessions', value: '432', change: '+5%', icon: '🔄' },
    { label: 'Conversion Rate', value: '3.2%', change: '-1%', icon: '📈' },
  ];
  
  // Sample data for the chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Users',
        data: [120, 150, 180, 220, 250, 300],
        color: '#7928CA',
      },
      {
        label: 'Revenue',
        data: [1200, 1500, 1800, 2200, 2500, 3000],
        color: '#FF0080',
      },
    ],
  };
  
  return (
    <Layout>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.actions}>
          <button className={styles.button}>Export</button>
          <button className={styles.buttonPrimary}>New Report</button>
        </div>
      </div>
      
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>
      
      <div className={styles.chartSection}>
        <h2 className={styles.sectionTitle}>Performance Overview</h2>
        <div className={styles.chartContainer}>
          <Chart data={chartData} />
        </div>
      </div>
      
      <div className={styles.recentActivity}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>📝</div>
            <div className={styles.activityContent}>
              <h3 className={styles.activityTitle}>New user registered</h3>
              <p className={styles.activityTime}>5 minutes ago</p>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>💰</div>
            <div className={styles.activityContent}>
              <h3 className={styles.activityTitle}>New order placed</h3>
              <p className={styles.activityTime}>15 minutes ago</p>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>⚠️</div>
            <div className={styles.activityContent}>
              <h3 className={styles.activityTitle}>Server alert: High CPU usage</h3>
              <p className={styles.activityTime}>30 minutes ago</p>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>✅</div>
            <div className={styles.activityContent}>
              <h3 className={styles.activityTitle}>Task completed: Database backup</h3>
              <p className={styles.activityTime}>1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
