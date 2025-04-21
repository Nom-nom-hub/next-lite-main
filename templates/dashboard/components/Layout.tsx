import React, { useState } from 'react';
import { useRouter } from '../router';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? '' : styles.collapsed}`}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>Admin</h1>
          <button 
            className={styles.toggleButton}
            onClick={toggleSidebar}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a 
                className={`${styles.navLink} ${router.currentPath === '/' ? styles.active : ''}`}
                onClick={() => router.navigate('/')}
              >
                <span className={styles.navIcon}>📊</span>
                {sidebarOpen && <span className={styles.navText}>Dashboard</span>}
              </a>
            </li>
            <li className={styles.navItem}>
              <a 
                className={`${styles.navLink} ${router.currentPath === '/users' ? styles.active : ''}`}
                onClick={() => router.navigate('/users')}
              >
                <span className={styles.navIcon}>👥</span>
                {sidebarOpen && <span className={styles.navText}>Users</span>}
              </a>
            </li>
            <li className={styles.navItem}>
              <a 
                className={`${styles.navLink} ${router.currentPath === '/analytics' ? styles.active : ''}`}
                onClick={() => router.navigate('/analytics')}
              >
                <span className={styles.navIcon}>📈</span>
                {sidebarOpen && <span className={styles.navText}>Analytics</span>}
              </a>
            </li>
            <li className={styles.navItem}>
              <a 
                className={`${styles.navLink} ${router.currentPath === '/settings' ? styles.active : ''}`}
                onClick={() => router.navigate('/settings')}
              >
                <span className={styles.navIcon}>⚙️</span>
                {sidebarOpen && <span className={styles.navText}>Settings</span>}
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.search}>
            <input 
              type="text" 
              placeholder="Search..." 
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.headerActions}>
            <button className={styles.headerButton}>
              <span className={styles.headerButtonIcon}>🔔</span>
            </button>
            <button className={styles.headerButton}>
              <span className={styles.headerButtonIcon}>✉️</span>
            </button>
            <div className={styles.userProfile}>
              <img 
                src="https://via.placeholder.com/40" 
                alt="User" 
                className={styles.userAvatar}
              />
            </div>
          </div>
        </header>
        
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
