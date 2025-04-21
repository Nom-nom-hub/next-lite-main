import React from 'react';
import { useRouter } from '../../../../example/router';

export default function ProfilePage() {
  const router = useRouter();
  
  return (
    <div>
      <h1>Profile Page</h1>
      <p>This page is protected by authentication middleware.</p>
      <p>Current route group: {router.routeGroup}</p>
      
      <button
        onClick={() => {
          localStorage.setItem('isAuthenticated', 'false');
          router.navigate('/login');
        }}
      >
        Log Out
      </button>
    </div>
  );
}
