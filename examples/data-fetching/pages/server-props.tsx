import React from 'react';
import { useRouter } from '../../../example/router';

interface ServerPropsPageProps {
  data: string;
  timestamp: string;
}

export default function ServerPropsPage({ data, timestamp }: ServerPropsPageProps) {
  const router = useRouter();
  
  return (
    <div>
      <h1>Server Props Example</h1>
      <p>This page demonstrates the use of getServerSideProps for data fetching.</p>
      
      <div className="card">
        <h2>Server Data</h2>
        <p>{data}</p>
        <p>Fetched at: {timestamp}</p>
      </div>
      
      <p>
        This data was fetched on the server for each request using getServerSideProps.
        Refresh the page to see the timestamp change.
      </p>
      
      <button onClick={() => router.navigate('/')}>
        Back to Home
      </button>
    </div>
  );
}

// This function runs on every request
export async function getServerSideProps(context) {
  // Simulate data fetching
  const data = 'This is server data fetched on each request';
  
  // Log the context object
  console.log('Server-side context:', {
    params: context.params,
    query: context.query,
    resolvedUrl: context.resolvedUrl,
  });
  
  return {
    props: {
      data,
      timestamp: new Date().toISOString(),
    },
  };
}
