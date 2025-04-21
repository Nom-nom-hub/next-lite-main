import React from 'react';
import { useRouter } from '../../../../example/router';

interface DynamicPageProps {
  id: string;
  data: any;
}

export default function DynamicPage({ id, data }: DynamicPageProps) {
  const router = useRouter();
  
  return (
    <div>
      <h1>Dynamic Route with Server-Side Props</h1>
      <p>This page demonstrates dynamic routes with getServerSideProps.</p>
      
      <div className="card">
        <h2>Item ID: {id}</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      
      <p>
        The data above was fetched on the server based on the ID in the URL.
        Try changing the ID in the URL to see different data.
      </p>
      
      <div className="button-group">
        <button onClick={() => router.navigate('/dynamic/123')}>
          Load ID: 123
        </button>
        <button onClick={() => router.navigate('/dynamic/456')}>
          Load ID: 456
        </button>
        <button onClick={() => router.navigate('/dynamic/789')}>
          Load ID: 789
        </button>
        <button onClick={() => router.navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

// This function runs on every request
export async function getServerSideProps(context) {
  // Get the ID from the URL
  const { id } = context.params;
  
  // Simulate fetching data based on the ID
  const data = await fetchItemData(id);
  
  // If the item doesn't exist, return 404
  if (!data) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      id,
      data,
    },
  };
}

// Simulate an API call
async function fetchItemData(id) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Mock data based on ID
  const items = {
    '123': {
      name: 'Item 123',
      description: 'This is item 123',
      price: 12.99,
      inStock: true,
    },
    '456': {
      name: 'Item 456',
      description: 'This is item 456',
      price: 45.99,
      inStock: false,
    },
    '789': {
      name: 'Item 789',
      description: 'This is item 789',
      price: 78.99,
      inStock: true,
    },
  };
  
  return items[id] || null;
}
