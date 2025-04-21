# Router API

The Next-Lite router provides client-side navigation and routing functionality.

## Components

### `<RouterProvider>`

The `RouterProvider` component is the main router component that provides routing functionality to your application.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `routes` | `Record<string, () => JSX.Element>` | (required) | A record of routes and their corresponding components |
| `initialPath` | `string` | `undefined` | The initial path for server-side rendering |
| `initialProps` | `Record<string, any>` | `{}` | Initial props for server-side rendering |
| `routeGroups` | `Record<string, any>` | `{}` | Route group configurations |
| `routeMiddleware` | `Record<string, Function>` | `{}` | Route-specific middleware functions |

#### Example

```tsx
import { RouterProvider } from 'next-lite/router';

const routes = {
  '/': HomePage,
  '/about': AboutPage,
  '/blog': BlogPage,
  '/blog/[id]': BlogPostPage,
};

function App() {
  return (
    <RouterProvider
      routes={routes}
      initialPath={typeof window === 'undefined' ? '/' : undefined}
    />
  );
}
```

### `<Link>`

The `Link` component is used for client-side navigation between routes.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | (required) | The target path |
| `children` | `React.ReactNode` | (required) | The link content |
| `className` | `string` | `undefined` | CSS class for the link |
| `activeClassName` | `string` | `undefined` | CSS class to apply when the link is active |
| `prefetch` | `boolean` | `false` | Whether to prefetch the linked page |
| `replace` | `boolean` | `false` | Whether to replace the current history entry |
| `scroll` | `boolean` | `true` | Whether to scroll to the top after navigation |
| `shallow` | `boolean` | `false` | Whether to perform a shallow route change |

#### Example

```tsx
import { Link } from 'next-lite/router';

function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog" activeClassName="active">Blog</Link>
      <Link href="/contact" prefetch>Contact</Link>
    </nav>
  );
}
```

## Hooks

### `useRouter`

The `useRouter` hook provides access to the router context.

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `currentPath` | `string` | The current path |
| `navigate` | `(path: string, options?: NavigateOptions) => void` | Function to navigate to a new path |
| `params` | `Record<string, string>` | Route parameters |
| `query` | `Record<string, string>` | Query parameters |
| `routeGroup` | `string \| undefined` | The current route group |
| `isSSR` | `boolean` | Whether the code is running on the server |
| `initialProps` | `Record<string, any>` | Initial props from server-side rendering |

#### Example

```tsx
import { useRouter } from 'next-lite/router';

function BlogPost() {
  const router = useRouter();
  const { id } = router.params;
  const { tab } = router.query;
  
  return (
    <div>
      <h1>Blog Post {id}</h1>
      <p>Current tab: {tab}</p>
      <button onClick={() => router.navigate('/blog')}>
        Back to Blog
      </button>
    </div>
  );
}
```

### `useRouteMatch`

The `useRouteMatch` hook checks if the current path matches a pattern.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `pattern` | `string` | The route pattern to match |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `isMatch` | `boolean` | Whether the current path matches the pattern |
| `params` | `Record<string, string>` | Route parameters if the pattern matches |

#### Example

```tsx
import { useRouteMatch } from 'next-lite/router';

function BlogLayout() {
  const { isMatch, params } = useRouteMatch('/blog/:id');
  
  if (isMatch) {
    return <BlogPost id={params.id} />;
  }
  
  return <BlogList />;
}
```

## Types

### `NavigateOptions`

Options for the `navigate` function.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `replace` | `boolean` | `false` | Whether to replace the current history entry |
| `scroll` | `boolean` | `true` | Whether to scroll to the top after navigation |
| `shallow` | `boolean` | `false` | Whether to perform a shallow route change |

### `RouterContextType`

The router context type.

| Property | Type | Description |
|----------|------|-------------|
| `currentPath` | `string` | The current path |
| `navigate` | `(path: string, options?: NavigateOptions) => void` | Function to navigate to a new path |
| `params` | `Record<string, string>` | Route parameters |
| `query` | `Record<string, string>` | Query parameters |
| `routeGroup` | `string \| undefined` | The current route group |
| `isSSR` | `boolean` | Whether the code is running on the server |
| `initialProps` | `Record<string, any>` | Initial props from server-side rendering |
