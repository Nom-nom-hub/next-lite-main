import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Card({ 
  children, 
  variant = 'default',
  hover = false,
  clickable = false,
  onClick,
  ...props 
}) {
  const { theme } = useTheme();
  
  // Define styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: theme.card,
          border: `1px solid ${theme.border}`,
        };
      case 'elevated':
        return {
          backgroundColor: theme.card,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: 'none',
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          border: `1px solid ${theme.border}`,
        };
      case 'filled':
        return {
          backgroundColor: theme.primary + '11', // Very light primary color
          border: 'none',
        };
      default:
        return {
          backgroundColor: theme.card,
          border: `1px solid ${theme.border}`,
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  const cardStyles = {
    borderRadius: '8px',
    padding: '1.5rem',
    transition: 'all 0.2s ease',
    cursor: clickable ? 'pointer' : 'default',
    transform: 'translateY(0)',
    ...variantStyles,
    '&:hover': hover ? {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
      borderColor: theme.primary,
    } : {},
    ...props.style
  };
  
  return (
    <div 
      style={cardStyles}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
