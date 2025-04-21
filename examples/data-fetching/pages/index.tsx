import React from 'react';
import { useRouter } from '../../../example/router';

export default function HomePage() {
  const router = useRouter();
  
  return (
    <div>
      <h1>Data Fetching Example</h1>
      <p>This example demonstrates data fetching in Next-Lite.</p>
      
      <h2>Navigation</h2>
      <ul>
        <li>
          <button onClick={() => router.navigate('/static-props')}>
            Static Props Example
          </button>
        </li>
        <li>
          <button onClick={() => router.navigate('/server-props')}>
            Server Props Example
          </button>
        </li>
        <li>
          <button onClick={() => router.navigate('/dynamic/123')}>
            Dynamic Route with getServerSideProps
          </button>
        </li>
      </ul>
      
      <h2>Data Fetching Methods</h2>
      <div className="card">
        <h3>getStaticProps</h3>
        <p>
          Used for static site generation (SSG). Data is fetched at build time.
        </p>
        <pre>{`
export async function getStaticProps(context) {
  return {
    props: {
      data: 'Static data fetched at build time'
    }
  }
}
        `}</pre>
      </div>
      
      <div className="card">
        <h3>getServerSideProps</h3>
        <p>
          Used for server-side rendering (SSR). Data is fetched on each request.
        </p>
        <pre>{`
export async function getServerSideProps(context) {
  return {
    props: {
      data: 'Server data fetched on each request'
    }
  }
}
        `}</pre>
      </div>
    </div>
  );
}
