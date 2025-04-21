import React from 'react';
import { useRouter } from '../../../example/router';

interface StaticPropsPageProps {
  data: string;
  lastUpdated: string;
}

export default function StaticPropsPage({ data, lastUpdated }: StaticPropsPageProps) {
  const router = useRouter();
  
  return (
    <div>
      <h1>Static Props Example</h1>
      <p>This page demonstrates the use of getStaticProps for data fetching.</p>
      
      <div className="card">
        <h2>Static Data</h2>
        <p>{data}</p>
        <p>Last updated: {lastUpdated}</p>
      </div>
      
      <p>
        This data was fetched at build time using getStaticProps.
        It will not change until the site is rebuilt.
      </p>
      
      <button onClick={() => router.navigate('/')}>
        Back to Home
      </button>
    </div>
  );
}

// This function runs at build time
export async function getStaticProps() {
  // Simulate data fetching
  const data = 'This is static data fetched at build time';
  
  return {
    props: {
      data,
      lastUpdated: new Date().toISOString(),
    },
    // Revalidate every 60 seconds (ISR - Incremental Static Regeneration)
    revalidate: 60,
  };
}
