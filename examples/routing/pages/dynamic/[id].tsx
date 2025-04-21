import React from 'react';
import { useRouter } from '../../../../example/router';

export default function DynamicPage() {
  const router = useRouter();
  
  return (
    <div>
      <h1>Dynamic Route</h1>
      
      <h2>Route Parameters</h2>
      <pre>{JSON.stringify(router.params, null, 2)}</pre>
      
      <h2>Query Parameters</h2>
      <pre>{JSON.stringify(router.query, null, 2)}</pre>
      
      <button onClick={() => router.navigate('/')}>
        Back to Home
      </button>
    </div>
  );
}
