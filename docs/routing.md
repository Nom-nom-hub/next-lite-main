# Advanced Routing in Next-Lite

Next-Lite provides a powerful routing system with support for dynamic routes, route groups, and middleware.

## File-Based Routing

Next-Lite uses a file-based routing system similar to Next.js. Files in your `pages` directory automatically become routes:

```
pages/
├── index.tsx      # → /
├── about.tsx      # → /about
└── blog/
    ├── index.tsx  # → /blog
    └── [id].tsx   # → /blog/:id
```

## Dynamic Routes

You can create dynamic routes using brackets `[]` in the file name:

```
pages/
├── users/
│   └── [id].tsx   # → /users/:id
└── blog/
    └── [slug].tsx # → /blog/:slug
```

You can access the dynamic parameters using the `useRouter` hook:

```tsx
// pages/users/[id].tsx
import React from 'react';
import { useRouter } from 'next-lite/router';

export default function UserPage() {
  const router = useRouter();
  const { id } = router.params;
  
  return (
    <div>
      <h1>User {id}</h1>
    </div>
  );
}
```

## Catch-All Routes

You can create catch-all routes using spread syntax `[...param]`:

```
pages/
└── docs/
    └── [...slug].tsx # → /docs/:slug*
```

This will match `/docs/a`, `/docs/a/b`, `/docs/a/b/c`, etc.

```tsx
// pages/docs/[...slug].tsx
import React from 'react';
import { useRouter } from 'next-lite/router';

export default function DocsPage() {
  const router = useRouter();
  const { slug } = router.params; // Array of path segments
  
  return (
    <div>
      <h1>Documentation</h1>
      <p>Path: {slug.join('/')}</p>
    </div>
  );
}
```

## Optional Catch-All Routes

You can create optional catch-all routes using double brackets `[[...param]]`:

```
pages/
└── docs/
    └── [[...slug]].tsx # → /docs, /docs/:slug*
```

This will match `/docs`, `/docs/a`, `/docs/a/b`, etc.

```tsx
// pages/docs/[[...slug]].tsx
import React from 'react';
import { useRouter } from 'next-lite/router';

export default function DocsPage() {
  const router = useRouter();
  const { slug = [] } = router.params; // Array of path segments or undefined
  
  return (
    <div>
      <h1>Documentation</h1>
      {slug.length > 0 ? (
        <p>Path: {slug.join('/')}</p>
      ) : (
        <p>Root documentation page</p>
      )}
    </div>
  );
}
```

## Route Groups

Route groups allow you to organize your routes without affecting the URL structure. You can create a route group by wrapping a directory name in parentheses `()`:

```
pages/
├── index.tsx
├── about.tsx
└── (auth)/
    ├── login.tsx     # → /login
    ├── register.tsx  # → /register
    └── profile.tsx   # → /profile
```

Route groups are useful for:

- Organizing routes by feature or section
- Applying middleware to a group of routes
- Sharing layouts between routes

### Route Group Configuration

You can configure a route group by adding a `_route-group.js` file:

```js
// pages/(auth)/_route-group.js
module.exports = {
  // Group name
  name: 'auth',
  
  // Group layout (optional)
  layout: 'AuthLayout',
  
  // Group metadata
  meta: {
    requiresAuth: true,
    title: 'Authentication',
  },
};
```

You can access the route group information using the `useRouter` hook:

```tsx
// pages/(auth)/profile.tsx
import React from 'react';
import { useRouter } from 'next-lite/router';

export default function ProfilePage() {
  const router = useRouter();
  
  // Access route group information
  console.log(router.routeGroup); // 'auth'
  
  return (
    <div>
      <h1>Profile Page</h1>
    </div>
  );
}
```

## Middleware

You can add middleware to routes by creating a `_middleware.js` file:

```
pages/
├── _middleware.js        # Applied to all routes
├── index.tsx
├── about.tsx
└── (auth)/
    ├── _middleware.js    # Applied only to routes in (auth)
    ├── login.tsx
    ├── register.tsx
    └── profile.tsx
```

Example of a middleware file:

```js
// pages/(auth)/_middleware.js
module.exports = (context, next) => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to login page
    window.location.href = '/login?redirect=' + encodeURIComponent(context.path);
    return;
  }
  
  // User is authenticated, continue to the route
  next();
};
```

See the [Middleware documentation](./middleware.md) for more details.

## Navigation

### Link Component

You can use the `Link` component for client-side navigation:

```tsx
import React from 'react';
import { Link } from 'next-lite/router';

export default function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
```

### useRouter Hook

You can use the `useRouter` hook for programmatic navigation:

```tsx
import React from 'react';
import { useRouter } from 'next-lite/router';

export default function HomePage() {
  const router = useRouter();
  
  const handleClick = () => {
    router.navigate('/about');
  };
  
  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleClick}>Go to About</button>
    </div>
  );
}
```

The `useRouter` hook provides:

- `currentPath`: The current path
- `navigate`: Function to navigate to a new path
- `params`: Route parameters
- `query`: Query parameters
- `routeGroup`: The current route group

```tsx
const router = useRouter();

// Current path
console.log(router.currentPath); // '/users/123'

// Route parameters
console.log(router.params); // { id: '123' }

// Query parameters
console.log(router.query); // { tab: 'profile' }

// Route group
console.log(router.routeGroup); // 'auth'

// Navigate to a new path
router.navigate('/about');

// Navigate with query parameters
router.navigate('/users/123?tab=profile');

// Navigate with options
router.navigate('/about', { replace: true }); // Replace current history entry
```

## Query Parameters

You can access query parameters using the `useRouter` hook:

```tsx
// pages/search.tsx
import React from 'react';
import { useRouter } from 'next-lite/router';

export default function SearchPage() {
  const router = useRouter();
  const { q, page } = router.query;
  
  return (
    <div>
      <h1>Search Results</h1>
      <p>Query: {q}</p>
      <p>Page: {page || 1}</p>
    </div>
  );
}
```

## Error Handling

You can create a custom 404 page by adding a `404.tsx` file in the `pages` directory:

```tsx
// pages/404.tsx
import React from 'react';
import { Link } from 'next-lite/router';

export default function NotFoundPage() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link href="/">Go Home</Link>
    </div>
  );
}
```

You can also create a custom 500 page for server errors:

```tsx
// pages/500.tsx
import React from 'react';
import { Link } from 'next-lite/router';

export default function ErrorPage() {
  return (
    <div>
      <h1>500 - Server Error</h1>
      <p>Something went wrong on the server.</p>
      <Link href="/">Go Home</Link>
    </div>
  );
}
```
