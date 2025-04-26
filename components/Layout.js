import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';

export default function Layout({ children }) {
  const { theme } = useTheme();
  
  // Apply theme styles to the body
  useEffect(() => {
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
  }, [theme]);

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Header />
      <main style={{ 
        flex: '1 0 auto',
        padding: '2rem 0'
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
