import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  ...props
}) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  
  const handleFocus = () => {
    setFocused(true);
  };
  
  const handleBlur = () => {
    setFocused(false);
  };
  
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    width: fullWidth ? '100%' : 'auto',
    marginBottom: '1rem',
    ...props.containerStyle
  };
  
  const labelStyles = {
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: error ? theme.error : theme.text,
    display: 'flex',
    alignItems: 'center',
    ...props.labelStyle
  };
  
  const inputWrapperStyles = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    ...props.inputWrapperStyle
  };
  
  const inputStyles = {
    width: '100%',
    padding: icon ? (iconPosition === 'left' ? '0.75rem 0.75rem 0.75rem 2.5rem' : '0.75rem 2.5rem 0.75rem 0.75rem') : '0.75rem',
    borderRadius: '4px',
    border: `1px solid ${error ? theme.error : focused ? theme.primary : theme.border}`,
    backgroundColor: theme.background,
    color: theme.text,
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    opacity: disabled ? 0.7 : 1,
    '&:focus': {
      borderColor: theme.primary,
      boxShadow: `0 0 0 2px ${theme.primary}33`,
    },
    '&::placeholder': {
      color: theme.text + '66',
    },
    ...props.inputStyle
  };
  
  const iconStyles = {
    position: 'absolute',
    [iconPosition === 'left' ? 'left' : 'right']: '0.75rem',
    color: theme.text,
    fontSize: '1.25rem',
    pointerEvents: 'none',
    ...props.iconStyle
  };
  
  const helperTextStyles = {
    marginTop: '0.25rem',
    fontSize: '0.75rem',
    color: error ? theme.error : theme.text + '99',
    ...props.helperTextStyle
  };
  
  return (
    <div style={containerStyles}>
      {label && (
        <label style={labelStyles}>
          {label}
          {required && <span style={{ color: theme.error, marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      
      <div style={inputWrapperStyles}>
        {icon && (
          <span style={iconStyles}>
            {icon}
          </span>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={inputStyles}
          {...props}
        />
      </div>
      
      {(helperText || error) && (
        <p style={helperTextStyles}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
