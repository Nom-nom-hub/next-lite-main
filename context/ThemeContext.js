import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Available themes
const themes = {
  light: {
    name: 'light',
    background: '#ffffff',
    text: '#333333',
    primary: '#7928CA',
    secondary: '#FF0080',
    accent: '#0070f3',
    border: '#eaeaea',
    card: '#ffffff',
    error: '#ff4d4f',
    success: '#52c41a',
    warning: '#faad14'
  },
  dark: {
    name: 'dark',
    background: '#1f1f1f',
    text: '#f5f5f5',
    primary: '#9d4edd',
    secondary: '#ff79c6',
    accent: '#3291ff',
    border: '#333333',
    card: '#2d2d2d',
    error: '#ff6b6b',
    success: '#6dd474',
    warning: '#ffd166'
  }
};

// Theme provider component
export function ThemeProvider({ children }) {
  // Check if user has a theme preference in localStorage
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme && themes[savedTheme]) {
        return savedTheme;
      }
      
      // Check for system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    
    // Default to light theme
    return 'light';
  };

  const [themeName, setThemeName] = useState(getInitialTheme);
  const [themeColors, setThemeColors] = useState(themes[getInitialTheme()]);

  // Update theme when themeName changes
  useEffect(() => {
    setThemeColors(themes[themeName]);
    
    // Save theme preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', themeName);
      
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', themeName);
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', themes[themeName].background);
      }
    }
  }, [themeName]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeName(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Set a specific theme
  const setTheme = (name) => {
    if (themes[name]) {
      setThemeName(name);
    } else {
      console.error(`Theme "${name}" not found`);
    }
  };

  // Context value
  const value = {
    theme: themeColors,
    themeName,
    toggleTheme,
    setTheme,
    isDark: themeName === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
