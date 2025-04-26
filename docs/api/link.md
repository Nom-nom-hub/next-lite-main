# Link Component API

The `Link` component is used for client-side navigation between pages in your Next-Lite application. It's a wrapper around the HTML `<a>` tag that provides prefetching and client-side navigation.

## Import

```jsx
import Link from 'next-lite-framework/link';
```

## Basic Usage

```jsx
<Link href="/about">
  <a>About Us</a>
</Link>
```

Or with automatic `<a>` tag (recommended):

```jsx
<Link href="/about">About Us</Link>
```

## Props

### `href` (required)

The path or URL to navigate to.

```jsx
<Link href="/about">About</Link>
```

You can also pass an object with `pathname`, `query`, and `hash` properties:

```jsx
<Link
  href={{
    pathname: '/blog/[slug]',
    query: { slug: 'hello-world' },
    hash: 'comments',
  }}
>
  Blog Post
</Link>
```

This will navigate to `/blog/hello-world#comments`.

### `as`

The path that will be displayed in the browser URL bar. Used for dynamic routes.

```jsx
<Link href="/blog/[slug]" as="/blog/hello-world">
  Blog Post
</Link>
```

### `replace`

When `true`, the navigation will replace the current history state instead of adding a new entry to the browser's history stack.

```jsx
<Link href="/about" replace>
  About
</Link>
```

### `scroll`

When `false`, the page will not scroll to the top after navigation. Defaults to `true`.

```jsx
<Link href="/about" scroll={false}>
  About
</Link>
```

### `prefetch`

When `true`, Next-Lite will prefetch the page in the background. Defaults to `true` in production.

```jsx
<Link href="/about" prefetch={false}>
  About
</Link>
```

### `locale`

The locale to use for the destination page. Defaults to the current locale.

```jsx
<Link href="/about" locale="fr">
  À propos
</Link>
```

### `passHref`

Forces Next-Lite to pass the `href` prop to the child `<a>` tag. Useful when using third-party components that wrap an `<a>` tag.

```jsx
<Link href="/about" passHref>
  <CustomLink>About</CustomLink>
</Link>
```

### `shallow`

When `true`, the navigation will not trigger data fetching methods like `getServerSideProps` or `getStaticProps`.

```jsx
<Link href="/dashboard?page=2" shallow>
  Next Page
</Link>
```

## Examples

### Basic Navigation

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
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
```

### Dynamic Routes

```jsx
import Link from 'next-lite-framework/link';

export default function BlogList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

### With Query Parameters

```jsx
import Link from 'next-lite-framework/link';

export default function Pagination({ currentPage, totalPages }) {
  return (
    <div>
      {currentPage > 1 && (
        <Link href={`/blog?page=${currentPage - 1}`}>
          Previous
        </Link>
      )}
      
      {currentPage < totalPages && (
        <Link href={`/blog?page=${currentPage + 1}`}>
          Next
        </Link>
      )}
    </div>
  );
}
```

### With Custom Styling

```jsx
import Link from 'next-lite-framework/link';
import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav>
      <Link href="/" className={styles.link}>
        Home
      </Link>
      <Link href="/about" className={styles.link}>
        About
      </Link>
    </nav>
  );
}
```

### With Active Link Detection

```jsx
import Link from 'next-lite-framework/link';
import { useRouter } from 'next-lite-framework/router';
import styles from './Navigation.module.css';

export default function Navigation() {
  const router = useRouter();
  
  return (
    <nav>
      <Link
        href="/"
        className={`${styles.link} ${router.pathname === '/' ? styles.active : ''}`}
      >
        Home
      </Link>
      <Link
        href="/about"
        className={`${styles.link} ${router.pathname === '/about' ? styles.active : ''}`}
      >
        About
      </Link>
    </nav>
  );
}
```

## Related

- [Router API](./router.md) - API reference for the router object
- [Routing Guide](../guides/routing.md) - Learn about Next-Lite's routing system
