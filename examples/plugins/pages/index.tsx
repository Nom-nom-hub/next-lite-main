import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch analytics data
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAnalytics();
    
    // Refresh analytics data every 10 seconds
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);
  
  // Track custom event
  const trackCustomEvent = () => {
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'button_click',
        data: { button: 'track_event', timestamp: new Date().toISOString() }
      })
    });
  };
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Next-Lite Plugin System</h1>
        <p className={styles.description}>
          This example demonstrates the plugin system in Next-Lite.
        </p>
      </header>
      
      <main className={styles.main}>
        <div className={styles.card}>
          <h2>Active Plugins</h2>
          <ul className={styles.pluginList}>
            <li className={styles.pluginItem}>
              <span className={styles.pluginName}>Analytics Plugin</span>
              <span className={styles.pluginStatus}>Active</span>
            </li>
            <li className={styles.pluginItem}>
              <span className={styles.pluginName}>Theme Plugin</span>
              <span className={styles.pluginStatus}>Active</span>
            </li>
            <li className={styles.pluginItem}>
              <span className={styles.pluginName}>SEO Plugin</span>
              <span className={styles.pluginStatus}>Active</span>
            </li>
          </ul>
        </div>
        
        <div className={styles.card}>
          <h2>Analytics Data</h2>
          {loading ? (
            <p>Loading analytics data...</p>
          ) : analyticsData ? (
            <div>
              <h3>Page Views</h3>
              <ul className={styles.analyticsList}>
                {Object.entries(analyticsData.pageViews).map(([path, views]) => (
                  <li key={path} className={styles.analyticsItem}>
                    <span className={styles.analyticsPath}>{path}</span>
                    <span className={styles.analyticsValue}>{views} views</span>
                  </li>
                ))}
              </ul>
              
              <h3>Recent Performance</h3>
              <ul className={styles.analyticsList}>
                {analyticsData.performance.slice(0, 5).map((perf, index) => (
                  <li key={index} className={styles.analyticsItem}>
                    <span className={styles.analyticsPath}>{perf.path}</span>
                    <span className={styles.analyticsValue}>{perf.duration}ms</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No analytics data available.</p>
          )}
          
          <button 
            className={styles.button}
            onClick={trackCustomEvent}
          >
            Track Custom Event
          </button>
        </div>
        
        <div className={styles.card}>
          <h2>Theme Plugin</h2>
          <p>
            The theme plugin adds dark mode support to your application.
            Click the toggle button in the bottom right corner to switch between light and dark mode.
          </p>
          
          <div className={styles.themePreview}>
            <div className={styles.themeCard}>
              <h3>Light Theme</h3>
              <div className={styles.colorSwatch}>
                <div className={styles.colorItem} style={{ backgroundColor: '#ffffff' }}>
                  <span>Background</span>
                </div>
                <div className={styles.colorItem} style={{ backgroundColor: '#333333', color: 'white' }}>
                  <span>Text</span>
                </div>
                <div className={styles.colorItem} style={{ backgroundColor: '#7928CA', color: 'white' }}>
                  <span>Primary</span>
                </div>
                <div className={styles.colorItem} style={{ backgroundColor: '#FF0080', color: 'white' }}>
                  <span>Secondary</span>
                </div>
              </div>
            </div>
            
            <div className={styles.themeCard} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
              <h3>Dark Theme</h3>
              <div className={styles.colorSwatch}>
                <div className={styles.colorItem} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                  <span>Background</span>
                </div>
                <div className={styles.colorItem} style={{ backgroundColor: '#f5f5f5', color: 'black' }}>
                  <span>Text</span>
                </div>
                <div className={styles.colorItem} style={{ backgroundColor: '#9d4edd', color: 'white' }}>
                  <span>Primary</span>
                </div>
                <div className={styles.colorItem} style={{ backgroundColor: '#ff5e5b', color: 'white' }}>
                  <span>Secondary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.card}>
          <h2>SEO Plugin</h2>
          <p>
            The SEO plugin adds meta tags to your pages for better search engine optimization.
            View the page source to see the added meta tags.
          </p>
          
          <div className={styles.codeBlock}>
            <pre>
              {`<meta name="description" content="Next-Lite Plugin System Example">
<meta name="keywords" content="next-lite, plugins, javascript, react">
<meta property="og:title" content="Next-Lite Plugins">
<meta property="og:description" content="Example of the Next-Lite plugin system">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">`}
            </pre>
          </div>
        </div>
        
        <div className={styles.card}>
          <h2>Creating Your Own Plugins</h2>
          <p>
            You can create your own plugins by using the <code>createPlugin</code> function:
          </p>
          
          <div className={styles.codeBlock}>
            <pre>
              {`const { createPlugin } = require('next-lite/plugin-system');

const myPlugin = createPlugin({
  name: 'my-plugin',
  
  // Plugin initialization
  init() {
    console.log('My plugin initialized');
  },
  
  // Plugin hooks
  hooks: {
    // Hook into different parts of the framework
    beforeBuild: (config) => {
      // Modify build configuration
      return config;
    },
    
    afterRender: (html) => {
      // Modify rendered HTML
      return html;
    },
    
    // Custom hooks
    custom: {
      myCustomHook: (data) => {
        // Custom hook logic
        return data;
      },
    },
  },
});

module.exports = myPlugin;`}
            </pre>
          </div>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <p>Powered by Next-Lite</p>
      </footer>
    </div>
  );
}
