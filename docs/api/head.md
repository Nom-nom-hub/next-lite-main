# Head Component API

The `Head` component allows you to modify the `<head>` section of your page, enabling you to set the title, meta tags, and other head elements for each page.

## Import

```jsx
import Head from 'next-lite-framework/head';
```

## Basic Usage

```jsx
import Head from 'next-lite-framework/head';

export default function HomePage() {
  return (
    <div>
      <Head>
        <title>My Page Title</title>
        <meta name="description" content="This is my page description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Welcome to my website</h1>
    </div>
  );
}
```

## Features

### Title Management

Set the page title:

```jsx
<Head>
  <title>My Page Title</title>
</Head>
```

### Meta Tags

Add meta tags for SEO and social media:

```jsx
<Head>
  <meta name="description" content="This is my page description" />
  <meta name="keywords" content="next-lite, react, javascript" />
  <meta name="author" content="Your Name" />
  
  {/* Open Graph tags for social media */}
  <meta property="og:title" content="My Page Title" />
  <meta property="og:description" content="This is my page description" />
  <meta property="og:image" content="https://example.com/image.jpg" />
  <meta property="og:url" content="https://example.com/page" />
  <meta property="og:type" content="website" />
  
  {/* Twitter Card tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="My Page Title" />
  <meta name="twitter:description" content="This is my page description" />
  <meta name="twitter:image" content="https://example.com/image.jpg" />
</Head>
```

### Favicon and Other Links

Add favicon and other link tags:

```jsx
<Head>
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" />
</Head>
```

### Scripts

Add script tags:

```jsx
<Head>
  <script src="https://example.com/script.js" />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          // Your inline script here
        })();
      `,
    }}
  />
</Head>
```

### Viewport Settings

Control the viewport for responsive design:

```jsx
<Head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</Head>
```

## Multiple Head Elements

You can use multiple `Head` components in your application. Next-Lite will merge them together:

```jsx
// components/Layout.js
import Head from 'next-lite-framework/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  );
}

// pages/index.js
import Head from 'next-lite-framework/head';
import Layout from '../components/Layout';

export default function HomePage() {
  return (
    <Layout>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="This is the home page" />
      </Head>
      <h1>Welcome to the home page</h1>
    </Layout>
  );
}
```

In this example, the final `<head>` will include all the elements from both `Head` components.

## Duplicate Tags

If you have duplicate tags, Next-Lite will use the last one by default:

```jsx
<Head>
  <title>First Title</title>
  <title>Second Title</title> {/* This one will be used */}
</Head>
```

## Key Property

You can use the `key` property to deduplicate tags:

```jsx
<Head>
  <title key="title">My Title</title>
</Head>

{/* Later in the component tree */}
<Head>
  <title key="title">New Title</title> {/* This will replace the previous title */}
</Head>
```

## TypeScript Support

The `Head` component works with TypeScript:

```tsx
import Head from 'next-lite-framework/head';

interface PageProps {
  title: string;
  description: string;
}

export default function Page({ title, description }: PageProps) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <h1>{title}</h1>
    </div>
  );
}
```

## Examples

### Basic SEO Setup

```jsx
import Head from 'next-lite-framework/head';

export default function SEOPage() {
  const title = 'My Page Title';
  const description = 'This is my page description';
  const canonicalUrl = 'https://example.com/page';
  
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <h1>{title}</h1>
    </div>
  );
}
```

### Dynamic Head Content

```jsx
import Head from 'next-lite-framework/head';

export default function BlogPost({ post }) {
  return (
    <div>
      <Head>
        <title>{post.title} | My Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="article:published_time" content={post.publishedAt} />
      </Head>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
```

## Related

- [Pages Guide](../guides/pages.md) - Learn about pages in Next-Lite
- [SEO Best Practices](../guides/seo.md) - SEO best practices for Next-Lite applications
