import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  href,
  ...props 
}) {
  const { theme } = useTheme();
  
  // Define styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primary,
          color: 'white',
          border: 'none',
          '&:hover': {
            backgroundColor: theme.primary + 'dd', // Add transparency for hover effect
          }
        };
      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          color: 'white',
          border: 'none',
          '&:hover': {
            backgroundColor: theme.secondary + 'dd',
          }
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: theme.primary,
          border: `1px solid ${theme.primary}`,
          '&:hover': {
            backgroundColor: theme.primary + '11', // Very light background on hover
          }
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme.text,
          border: 'none',
          '&:hover': {
            backgroundColor: theme.border,
          }
        };
      case 'danger':
        return {
          backgroundColor: theme.error,
          color: 'white',
          border: 'none',
          '&:hover': {
            backgroundColor: theme.error + 'dd',
          }
        };
      case 'success':
        return {
          backgroundColor: theme.success,
          color: 'white',
          border: 'none',
          '&:hover': {
            backgroundColor: theme.success + 'dd',
          }
        };
      default:
        return {
          backgroundColor: theme.primary,
          color: 'white',
          border: 'none',
          '&:hover': {
            backgroundColor: theme.primary + 'dd',
          }
        };
    }
  };
  
  // Define styles based on size
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '0.4rem 0.75rem',
          fontSize: '0.875rem',
        };
      case 'medium':
        return {
          padding: '0.6rem 1.25rem',
          fontSize: '1rem',
        };
      case 'large':
        return {
          padding: '0.8rem 1.5rem',
          fontSize: '1.125rem',
        };
      default:
        return {
          padding: '0.6rem 1.25rem',
          fontSize: '1rem',
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  
  const buttonStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    fontWeight: 500,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...variantStyles,
    ...sizeStyles,
    ...props.style
  };
  
  // If href is provided, render an anchor tag
  if (href) {
    return (
      <a 
        href={href}
        style={buttonStyles}
        {...props}
      >
        {loading ? (
          <>
            <span style={{ display: 'inline-block', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }}>⟳</span>
            {children}
          </>
        ) : children}
      </a>
    );
  }
  
  // Otherwise render a button
  return (
    <button 
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      style={buttonStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span style={{ display: 'inline-block', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }}>⟳</span>
          {children}
        </>
      ) : children}
    </button>
  );
}
