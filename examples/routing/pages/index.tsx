import React from 'react';
import { useRouter } from '../../../example/router';

export default function HomePage() {
  const router = useRouter();
  
  return (
    <div>
      <h1>Advanced Routing Example</h1>
      <p>This example demonstrates route groups and middleware.</p>
      
      <h2>Navigation</h2>
      <ul>
        <li>
          <button onClick={() => router.navigate('/login')}>
            Login Page
          </button>
        </li>
        <li>
          <button onClick={() => router.navigate('/auth/profile')}>
            Profile Page (Protected)
          </button>
        </li>
        <li>
          <button onClick={() => router.navigate('/auth/settings')}>
            Settings Page (Protected)
          </button>
        </li>
        <li>
          <button onClick={() => router.navigate('/dynamic/123')}>
            Dynamic Route (ID: 123)
          </button>
        </li>
        <li>
          <button onClick={() => router.navigate('/dynamic/456?name=John&role=admin')}>
            Dynamic Route with Query Params
          </button>
        </li>
      </ul>
      
      <h2>Route Groups</h2>
      <p>
        Route groups are defined using parentheses in the directory name: <code>(auth)</code>
      </p>
      <p>
        They don't affect the URL path but can be used to group related routes.
      </p>
      
      <h2>Middleware</h2>
      <p>
        Middleware can be defined for specific routes or route groups using <code>_middleware.js</code> files.
      </p>
      <p>
        In this example, the auth routes are protected by authentication middleware.
      </p>
    </div>
  );
}
