import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <header style={{
      backgroundColor: isScrolled ? theme.card : theme.background,
      borderBottom: `1px solid ${theme.border}`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <a href="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: theme.primary,
          textDecoration: 'none'
        }}>
          Next-Lite Demo
        </a>
        
        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          {/* Main Navigation Links */}
          <div style={{
            display: ['none', 'flex'],
            gap: '1.5rem'
          }}>
            <a href="/" style={{
              color: theme.text,
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.2s ease'
            }}>Home</a>
            <a href="/blog" style={{
              color: theme.text,
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.2s ease'
            }}>Blog</a>
            <a href="/shop" style={{
              color: theme.text,
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.2s ease'
            }}>Shop</a>
            <a href="/about" style={{
              color: theme.text,
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.2s ease'
            }}>About</a>
            <a href="/contact" style={{
              color: theme.text,
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.2s ease'
            }}>Contact</a>
          </div>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: theme.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                transition: 'background-color 0.2s ease'
              }}
              aria-label="Toggle theme"
            >
              {theme.name === 'light' ? '🌙' : '☀️'}
            </button>
            
            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: theme.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                transition: 'background-color 0.2s ease',
                position: 'relative'
              }}
              aria-label="Open cart"
            >
              🛒
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: theme.primary,
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {totalItems}
                </span>
              )}
            </button>
            
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <button 
                  onClick={() => window.location.href = '/profile'}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: theme.text
                  }}
                >
                  <img 
                    src={user.avatar || 'https://via.placeholder.com/40'} 
                    alt={user.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <span style={{ display: ['none', 'inline'] }}>{user.name}</span>
                </button>
                <button 
                  onClick={logout}
                  style={{
                    marginLeft: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <a 
                  href="/login"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '4px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Login
                </a>
                <a 
                  href="/register"
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: theme.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Sign Up
                </a>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={toggleMenu}
              style={{
                display: ['flex', 'none'],
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '24px',
                height: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
              aria-label="Toggle menu"
            >
              <span style={{
                width: '100%',
                height: '2px',
                backgroundColor: theme.text,
                transition: 'transform 0.3s ease'
              }}></span>
              <span style={{
                width: '100%',
                height: '2px',
                backgroundColor: theme.text,
                transition: 'opacity 0.3s ease'
              }}></span>
              <span style={{
                width: '100%',
                height: '2px',
                backgroundColor: theme.text,
                transition: 'transform 0.3s ease'
              }}></span>
            </button>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          backgroundColor: theme.background,
          padding: '1rem',
          borderTop: `1px solid ${theme.border}`
        }}>
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <a href="/" style={{
              color: theme.text,
              textDecoration: 'none',
              fontWeight: 500,
              padding: '0.5rem 0'
            }}>Home</a>
            <a href="/blog" style={{
              color: theme.text,
              textDecoration: 'none',
              fontWeight: 500,
              padding: '0.5rem 0'
            }}>Blog</a>
            <a href="/shop" style={{
              color: theme.text,
              textDecoration: 'none',
              fontWeight: 500,
              padding: '0.5rem 0'
            }}>Shop</a>
            <a href="/about" style={{
              color: theme.text,
              textDecoration: 'none',
              fontWeight: 500,
              padding: '0.5rem 0'
            }}>About</a>
            <a href="/contact" style={{
              color: theme.text,
              textDecoration: 'none',
              fontWeight: 500,
              padding: '0.5rem 0'
            }}>Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
}
