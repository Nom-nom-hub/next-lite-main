import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button component for user interactions
 */
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const className = `${styles.button} ${styles[variant]} ${styles[size]}`;
  
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
      data-testid="button"
    >
      {children}
    </button>
  );
}
