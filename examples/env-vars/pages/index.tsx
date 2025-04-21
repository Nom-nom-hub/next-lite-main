import React from 'react';
import styles from '../styles/Home.module.css';

// Environment variables example
export default function HomePage() {
  // Get all environment variables that start with NEXT_LITE_
  const envVars = Object.keys(process.env)
    .filter(key => key.startsWith('NEXT_LITE_'))
    .reduce((obj, key) => {
      obj[key] = process.env[key];
      return obj;
    }, {});
    
  return (
    <div className={styles.container}>
      <h1>Environment Variables Example</h1>
      
      <p>
        Next-Lite supports environment variables through <code>.env</code> files.
        All variables must be prefixed with <code>NEXT_LITE_</code> to be exposed to the browser.
      </p>
      
      <div className="card">
        <h2>Available Environment Variables</h2>
        
        {Object.keys(envVars).length > 0 ? (
          Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="env-var">
              <span className="env-name">{key}</span>
              <span className="env-value">{value}</span>
            </div>
          ))
        ) : (
          <p>No environment variables found. Create a <code>.env</code> file with variables prefixed with <code>NEXT_LITE_</code>.</p>
        )}
      </div>
      
      <div className="note">
        <h3>How to use environment variables</h3>
        <p>
          1. Create a <code>.env</code> file in your project root<br />
          2. Add variables with the <code>NEXT_LITE_</code> prefix:<br />
          <code>NEXT_LITE_API_URL=https://api.example.com</code><br />
          <code>NEXT_LITE_APP_NAME=My Awesome App</code>
        </p>
        <p>
          3. Access them in your code with <code>process.env.NEXT_LITE_API_URL</code>
        </p>
      </div>
    </div>
  );
}
