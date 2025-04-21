import React from 'react';
import { useRouter } from '../../../../example/router';

export default function SettingsPage() {
  const router = useRouter();
  
  return (
    <div>
      <h1>Settings Page</h1>
      <p>This page is protected by authentication middleware.</p>
      <p>Current route group: {router.routeGroup}</p>
      
      <button onClick={() => router.navigate('/auth/profile')}>
        Go to Profile
      </button>
    </div>
  );
}
