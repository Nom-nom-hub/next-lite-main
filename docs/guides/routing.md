# Routing in Next-Lite

Next-Lite uses a file-based routing system, where each file in the `pages` directory automatically becomes a route in your application.

## Basic Routing

The simplest form of routing in Next-Lite is based on the file structure in the `pages` directory:

- `pages/index.js` → `/`
- `pages/about.js` → `/about`
- `pages/contact.js` → `/contact`

Example of a basic page:

```jsx
// pages/about.js
export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page</p>
    </div>
  );
}
```

## Nested Routes

You can create nested routes by creating subdirectories in the `pages` directory:

- `pages/blog/index.js` → `/blog`
- `pages/blog/first-post.js` → `/blog/first-post`
- `pages/blog/second-post.js` → `/blog/second-post`

## Dynamic Routes

Dynamic routes allow you to create pages that can match a variety of paths. You can create dynamic routes by adding brackets to a page filename:

- `pages/blog/[slug].js` → `/blog/first-post`, `/blog/second-post`, etc.
- `pages/[category]/[product].js` → `/clothing/shirt`, `/electronics/laptop`, etc.

Example of a dynamic route:

```jsx
// pages/blog/[slug].js
import { useRouter } from 'next-lite-framework/router';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <h1>Blog Post: {slug}</h1>
      <p>This is a dynamic blog post page</p>
    </div>
  );
}
```

## Accessing Route Parameters

You can access route parameters using the `useRouter` hook from `next-lite-framework/router`:

```jsx
import { useRouter } from 'next-lite-framework/router';

export default function Product() {
  const router = useRouter();
  const { category, product } = router.query;

  return (
    <div>
      <h1>Category: {category}</h1>
      <h2>Product: {product}</h2>
    </div>
  );
}
```

## Client-Side Navigation

For client-side navigation between pages, use the `Link` component from `next-lite-framework/link`:

```jsx
import Link from 'next-lite-framework/link';

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/blog/hello-world">Blog Post</Link>
        </li>
      </ul>
    </nav>
  );
}
```

## Programmatic Navigation

You can also navigate programmatically using the `router` object:

```jsx
import { useRouter } from 'next-lite-framework/router';

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform login logic
    // ...
    
    // Navigate to dashboard after successful login
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Login</button>
    </form>
  );
}
```

## Shallow Routing

Shallow routing allows you to change the URL without running data fetching methods again:

```jsx
// Change the URL without running getInitialProps, getServerSideProps, or getStaticProps
router.push('/dashboard?page=2', undefined, { shallow: true });
```

## Handling 404 Pages

You can create a custom 404 page by creating a `404.js` file in the `pages` directory:

```jsx
// pages/404.js
export default function Custom404() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}
```

## Next Steps

- [Pages](./pages.md) - Learn more about pages in Next-Lite
- [Link Component](../api/link.md) - API reference for the Link component
- [Router API](../api/router.md) - API reference for the router object
