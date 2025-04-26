import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';

// Import pages
import HomePage from './pages/index';
import BlogPostPage from './pages/blog/[slug]';
import LoginPage from './pages/login';
import ProfilePage from './pages/profile';
import ProductPage from './pages/shop/[slug]';

// Simple router
const Router = () => {
  const [path, setPath] = React.useState(window.location.pathname);
  
  React.useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Handle link clicks
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('/')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        window.history.pushState({}, '', href);
        setPath(href);
      }
    });
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  // Render the component for the current path
  const renderPage = () => {
    // Match exact routes first
    if (path === '/') {
      return <HomePage />;
    }
    
    if (path === '/login') {
      return <LoginPage />;
    }
    
    if (path === '/profile') {
      return <ProfilePage />;
    }
    
    // Match dynamic routes
    if (path.startsWith('/blog/')) {
      return <BlogPostPage />;
    }
    
    if (path.startsWith('/shop/')) {
      return <ProductPage />;
    }
    
    // 404 fallback
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ marginBottom: '1rem' }}>404 - Page Not Found</h1>
        <p style={{ marginBottom: '2rem' }}>The page you are looking for doesn't exist.</p>
        <button 
          onClick={() => {
            window.history.pushState({}, '', '/');
            setPath('/');
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#7928CA',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go Home
        </button>
      </div>
    );
  };
  
  return renderPage();
};

// App component with providers
const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Render the app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
