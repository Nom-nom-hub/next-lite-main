import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: theme.card,
      borderTop: `1px solid ${theme.border}`,
      padding: '3rem 0',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        {/* Company Info */}
        <div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: theme.primary,
            marginTop: 0,
            marginBottom: '1rem'
          }}>
            Next-Lite Demo
          </h3>
          <p style={{
            color: theme.text,
            marginBottom: '1rem'
          }}>
            A showcase of advanced features built with the lightweight Next-Lite framework.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
              color: theme.text,
              textDecoration: 'none',
              fontSize: '1.5rem'
            }}>
              𝕏
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{
              color: theme.text,
              textDecoration: 'none',
              fontSize: '1.5rem'
            }}>
              📂
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{
              color: theme.text,
              textDecoration: 'none',
              fontSize: '1.5rem'
            }}>
              🔗
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: theme.text,
            marginTop: 0,
            marginBottom: '1rem'
          }}>
            Quick Links
          </h4>
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <a href="/" style={{
              color: theme.text,
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>Home</a>
            <a href="/blog" style={{
              color: theme.text,
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>Blog</a>
            <a href="/shop" style={{
              color: theme.text,
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>Shop</a>
            <a href="/about" style={{
              color: theme.text,
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>About</a>
            <a href="/contact" style={{
              color: theme.text,
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>Contact</a>
          </nav>
        </div>

        {/* Resources */}
        <div>
          <h4 style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: theme.text,
            marginTop: 0,
            marginBottom: '1rem'
          }}>
            Resources
          </h4>
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <a href="/docs" style={{
              color: theme.text,
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>Documentation</a>
            <a href="/tutorials" style={{
              color: theme.text,
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>Tutorials</a>
            <a href="/faq" style={{
              color: theme.text,
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>FAQ</a>
            <a href="/support" style={{
              color: theme.text,
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>Support</a>
          </nav>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: theme.text,
            marginTop: 0,
            marginBottom: '1rem'
          }}>
            Subscribe to Our Newsletter
          </h4>
          <p style={{
            color: theme.text,
            marginBottom: '1rem'
          }}>
            Get the latest updates and news delivered to your inbox.
          </p>
          <form style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <input 
              type="email" 
              placeholder="Your email address" 
              style={{
                padding: '0.75rem',
                borderRadius: '4px',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.background,
                color: theme.text
              }}
            />
            <button 
              type="submit"
              style={{
                padding: '0.75rem',
                backgroundColor: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto 0',
        padding: '1.5rem 1.5rem 0',
        borderTop: `1px solid ${theme.border}`,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <p style={{
          color: theme.text,
          margin: 0
        }}>
          &copy; {currentYear} Next-Lite Demo. All rights reserved.
        </p>
        <nav style={{
          display: 'flex',
          gap: '1.5rem'
        }}>
          <a href="/privacy" style={{
            color: theme.text,
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}>Privacy Policy</a>
          <a href="/terms" style={{
            color: theme.text,
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}>Terms of Service</a>
          <a href="/cookies" style={{
            color: theme.text,
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}>Cookie Policy</a>
        </nav>
      </div>
    </footer>
  );
}
