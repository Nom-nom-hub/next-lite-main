# Data Fetching API

Next-Lite provides several methods for fetching data, similar to Next.js's `getServerSideProps` and `getStaticProps`.

## Functions

### `getServerSideProps`

Fetches data on each request.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `context` | `GetServerSidePropsContext` | Context object with request information |

#### Returns

| Type | Description |
|------|-------------|
| `Promise<GetServerSidePropsResult>` | Result object with props, redirect, or notFound |

#### Example

```tsx
// pages/users.tsx
export default function UsersPage({ users }) {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Fetch data from an API
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await res.json();
  
  return {
    props: {
      users,
    },
  };
}
```

### `getStaticProps`

Fetches data at build time.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `context` | `GetStaticPropsContext` | Context object with parameters |

#### Returns

| Type | Description |
|------|-------------|
| `Promise<GetStaticPropsResult>` | Result object with props, redirect, notFound, or revalidate |

#### Example

```tsx
// pages/posts.tsx
export default function PostsPage({ posts }) {
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  // Fetch data from an API
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();
  
  return {
    props: {
      posts,
    },
    // Revalidate every 60 seconds (ISR - Incremental Static Regeneration)
    revalidate: 60,
  };
}
```

### `getStaticPaths`

Specifies dynamic routes to pre-render based on data.

#### Returns

| Type | Description |
|------|-------------|
| `Promise<GetStaticPathsResult>` | Result object with paths and fallback |

#### Example

```tsx
// pages/posts/[id].tsx
export default function PostPage({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}

export async function getStaticProps(context) {
  const { id } = context.params;
  
  // Fetch data for a single post
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = await res.json();
  
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  // Fetch all posts
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();
  
  // Get the paths we want to pre-render
  const paths = posts.slice(0, 10).map(post => ({
    params: { id: post.id.toString() },
  }));
  
  return {
    paths,
    fallback: 'blocking',
  };
}
```

## Types

### `GetServerSidePropsContext`

Context object for `getServerSideProps`.

| Property | Type | Description |
|----------|------|-------------|
| `req` | `IncomingMessage` | The HTTP request object |
| `res` | `ServerResponse` | The HTTP response object |
| `params` | `Record<string, string \| string[]>` | Route parameters |
| `query` | `Record<string, string \| string[]>` | Query parameters |
| `resolvedUrl` | `string` | The resolved URL |
| `locale` | `string` | The current locale |
| `locales` | `string[]` | All supported locales |
| `defaultLocale` | `string` | The default locale |

### `GetServerSidePropsResult`

Result object for `getServerSideProps`.

| Property | Type | Description |
|----------|------|-------------|
| `props` | `Record<string, any>` | Props to pass to the page component |
| `redirect` | `{ destination: string, permanent: boolean }` | Redirect to another page |
| `notFound` | `boolean` | Return a 404 status |

### `GetStaticPropsContext`

Context object for `getStaticProps`.

| Property | Type | Description |
|----------|------|-------------|
| `params` | `Record<string, string \| string[]>` | Route parameters |
| `locale` | `string` | The current locale |
| `locales` | `string[]` | All supported locales |
| `defaultLocale` | `string` | The default locale |

### `GetStaticPropsResult`

Result object for `getStaticProps`.

| Property | Type | Description |
|----------|------|-------------|
| `props` | `Record<string, any>` | Props to pass to the page component |
| `redirect` | `{ destination: string, permanent: boolean }` | Redirect to another page |
| `notFound` | `boolean` | Return a 404 status |
| `revalidate` | `number` | Revalidation time in seconds |

### `GetStaticPathsResult`

Result object for `getStaticPaths`.

| Property | Type | Description |
|----------|------|-------------|
| `paths` | `Array<{ params: Record<string, string \| string[]> }>` | Paths to pre-render |
| `fallback` | `boolean \| 'blocking'` | Fallback behavior for paths not returned |
