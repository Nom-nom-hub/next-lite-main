import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { theme } = useTheme();
  const { login, isAuthenticated, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/profile';
    }
  }, [isAuthenticated]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!username.trim()) {
      setFormError('Username is required');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    try {
      setFormSubmitting(true);
      setFormError('');
      
      // Attempt login
      const success = await login(username, password);
      
      if (!success) {
        setFormError('Invalid username or password');
      }
    } catch (err) {
      setFormError(err.message || 'An error occurred during login');
    } finally {
      setFormSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div style={{
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '0 1.5rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          color: theme.text
        }}>
          Log In to Your Account
        </h1>
        
        <Card variant="elevated">
          <form onSubmit={handleSubmit}>
            {(formError || error) && (
              <div style={{
                backgroundColor: theme.error + '11',
                color: theme.error,
                padding: '1rem',
                borderRadius: '4px',
                marginBottom: '1.5rem'
              }}>
                {formError || error}
              </div>
            )}
            
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              fullWidth
              icon="👤"
              containerStyle={{ marginBottom: '1.5rem' }}
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              fullWidth
              icon="🔒"
              containerStyle={{ marginBottom: '2rem' }}
            />
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={formSubmitting || loading}
              disabled={formSubmitting || loading}
            >
              Log In
            </Button>
            
            <div style={{
              textAlign: 'center',
              marginTop: '1.5rem'
            }}>
              <a 
                href="/forgot-password"
                style={{
                  color: theme.primary,
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}
              >
                Forgot your password?
              </a>
            </div>
          </form>
        </Card>
        
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: theme.text + 'cc'
        }}>
          <p>
            Don't have an account?{' '}
            <a 
              href="/register"
              style={{
                color: theme.primary,
                textDecoration: 'none'
              }}
            >
              Sign up
            </a>
          </p>
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: theme.card,
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1rem',
            marginBottom: '1rem',
            color: theme.text
          }}>
            Demo Credentials
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: theme.text + 'cc',
            marginBottom: '0.5rem'
          }}>
            Username: <strong>johndoe</strong>
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: theme.text + 'cc'
          }}>
            Password: <strong>password123</strong>
          </p>
        </div>
      </div>
    </Layout>
  );
}
