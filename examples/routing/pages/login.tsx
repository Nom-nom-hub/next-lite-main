import React, { useState, useEffect } from 'react';
import { useRouter } from '../../../example/router';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState('');
  
  // Get redirect from query parameters
  useEffect(() => {
    if (router.query && router.query.redirect) {
      setRedirect(router.query.redirect);
    }
  }, [router.query]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate authentication
    if (username && password) {
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect to the original page or default to profile
      router.navigate(redirect || '/auth/profile');
    }
  };
  
  return (
    <div>
      <h1>Login Page</h1>
      <p>Please log in to access protected pages.</p>
      
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Log In</button>
      </form>
      
      {redirect && (
        <p>You will be redirected to: {redirect}</p>
      )}
    </div>
  );
}
