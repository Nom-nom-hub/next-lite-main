# Data Fetching in Next-Lite

Next-Lite provides several methods for fetching data, similar to Next.js's `getServerSideProps` and `getStaticProps`.

## Server-Side Rendering (SSR)

### getServerSideProps

Use `getServerSideProps` to fetch data on each request:

```tsx
// pages/users.tsx
import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersPageProps {
  users: User[];
}

export default function UsersPage({ users }: UsersPageProps) {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}

// This function runs on every request
export async function getServerSideProps(context) {
  // Fetch data from an API
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await res.json();
  
  // Return the data as props
  return {
    props: {
      users,
    },
  };
}
```

### Context Object

The `context` object contains:

- `req`: The HTTP request object
- `res`: The HTTP response object
- `params`: Route parameters
- `query`: Query parameters
- `resolvedUrl`: The resolved URL
- `locale`: The current locale
- `locales`: All supported locales
- `defaultLocale`: The default locale

```tsx
export async function getServerSideProps(context) {
  const { req, res, params, query } = context;
  
  // Use query parameters
  const page = query.page || 1;
  
  // Fetch data based on query parameters
  const data = await fetchData(page);
  
  return {
    props: {
      data,
    },
  };
}
```

### Redirects and Not Found

You can return redirects and not found responses:

```tsx
export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;
  
  // Fetch data
  const data = await fetchData(id);
  
  // If data not found, return 404
  if (!data) {
    return {
      notFound: true,
    };
  }
  
  // If data is moved, redirect
  if (data.moved) {
    return {
      redirect: {
        destination: `/new-path/${data.newId}`,
        permanent: true, // 308 status code
      },
    };
  }
  
  // Return data as props
  return {
    props: {
      data,
    },
  };
}
```

## Static Site Generation (SSG)

### getStaticProps

Use `getStaticProps` to fetch data at build time:

```tsx
// pages/posts.tsx
import React from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostsPageProps {
  posts: Post[];
}

export default function PostsPage({ posts }: PostsPageProps) {
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// This function runs at build time
export async function getStaticProps() {
  // Fetch data from an API
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();
  
  // Return the data as props
  return {
    props: {
      posts,
    },
    // Revalidate every 60 seconds (ISR - Incremental Static Regeneration)
    revalidate: 60,
  };
}
```

### getStaticPaths

Use `getStaticPaths` with dynamic routes:

```tsx
// pages/posts/[id].tsx
import React from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostPageProps {
  post: Post;
}

export default function PostPage({ post }: PostPageProps) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}

// This function runs at build time
export async function getStaticProps(context) {
  const { params } = context;
  const { id } = params;
  
  // Fetch data for a single post
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = await res.json();
  
  // Return the data as props
  return {
    props: {
      post,
    },
    // Revalidate every 60 seconds (ISR - Incremental Static Regeneration)
    revalidate: 60,
  };
}

// This function runs at build time
export async function getStaticPaths() {
  // Fetch all posts
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();
  
  // Get the paths we want to pre-render
  const paths = posts.slice(0, 10).map(post => ({
    params: { id: post.id.toString() },
  }));
  
  // We'll pre-render only these paths at build time
  // { fallback: false } means other routes should 404
  return {
    paths,
    fallback: false,
  };
}
```

### Fallback

The `fallback` option in `getStaticPaths` can be:

- `false`: Any paths not returned by `getStaticPaths` will result in a 404 page
- `true`: Paths not generated at build time will not result in a 404 page. Instead, Next-Lite will serve a "fallback" version of the page and generate the HTML in the background
- `'blocking'`: Similar to `true`, but the initial request will be server-side rendered with `getStaticProps` and cached for future requests

```tsx
export async function getStaticPaths() {
  // Fetch all posts
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();
  
  // Get the paths we want to pre-render
  const paths = posts.slice(0, 10).map(post => ({
    params: { id: post.id.toString() },
  }));
  
  // We'll pre-render only these paths at build time
  // { fallback: true } means other routes will be generated on-demand
  return {
    paths,
    fallback: true,
  };
}
```

## Client-Side Data Fetching

For data that doesn't need to be pre-rendered, you can fetch data on the client side:

```tsx
// pages/dashboard.tsx
import React, { useState, useEffect } from 'react';

interface DashboardData {
  stats: {
    users: number;
    posts: number;
    comments: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!data) {
    return <div>Error loading dashboard data</div>;
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Stats</h2>
        <ul>
          <li>Users: {data.stats.users}</li>
          <li>Posts: {data.stats.posts}</li>
          <li>Comments: {data.stats.comments}</li>
        </ul>
      </div>
    </div>
  );
}
```

## SWR for Data Fetching

Next-Lite works well with [SWR](https://swr.vercel.app/), a React hook for data fetching:

```tsx
// pages/dashboard.tsx
import React from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data, error } = useSWR('/api/dashboard', fetcher);
  
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Stats</h2>
        <ul>
          <li>Users: {data.stats.users}</li>
          <li>Posts: {data.stats.posts}</li>
          <li>Comments: {data.stats.comments}</li>
        </ul>
      </div>
    </div>
  );
}
```
