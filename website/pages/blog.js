import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';
import Layout from '../components/Layout';
import styles from '../styles/Blog.module.css';

const posts = [
  {
    title: 'Introducing Next-Lite: A Lightweight Alternative to Next.js',
    date: 'April 26, 2025',
    excerpt: 'Today, we're excited to announce the release of Next-Lite, a lightweight, zero-dependency alternative to Next.js that prioritizes speed and simplicity.',
    slug: 'introducing-next-lite'
  },
  {
    title: 'Next-Lite v0.4.0 Released: TypeScript Support, Documentation, and Tests',
    date: 'April 26, 2025',
    excerpt: 'We're thrilled to announce the release of Next-Lite v0.4.0, which includes TypeScript support, comprehensive documentation, and a test suite.',
    slug: 'next-lite-v0-4-0-released'
  },
  {
    title: 'Next-Lite v0.5.0: Server-Side Rendering and Image Optimization',
    date: 'April 26, 2025',
    excerpt: 'Next-Lite v0.5.0 is here with server-side rendering, image optimization, and more. Learn about the new features and how to use them.',
    slug: 'next-lite-v0-5-0-server-side-rendering-image-optimization'
  },
  {
    title: 'Building a Blog with Next-Lite',
    date: 'April 26, 2025',
    excerpt: 'Learn how to build a blog with Next-Lite, including file-based routing, markdown support, and more.',
    slug: 'building-a-blog-with-next-lite'
  },
  {
    title: 'Next-Lite vs Next.js: A Performance Comparison',
    date: 'April 26, 2025',
    excerpt: 'We compare Next-Lite and Next.js in terms of performance, bundle size, memory usage, and more.',
    slug: 'next-lite-vs-nextjs-performance-comparison'
  },
  {
    title: 'Using Next-Lite with TypeScript',
    date: 'April 26, 2025',
    excerpt: 'Learn how to use Next-Lite with TypeScript, including type-safe API routes, components, and more.',
    slug: 'using-next-lite-with-typescript'
  }
];

export default function Blog() {
  return (
    <Layout
      title="Blog - Next-Lite Framework"
      description="Latest news and updates about the Next-Lite framework."
    >
      <div className={styles.container}>
        <h1 className={styles.title}>Next-Lite Blog</h1>
        <p className={styles.description}>
          Latest news and updates about the Next-Lite framework.
        </p>

        <div className={styles.posts}>
          {posts.map((post, index) => (
            <article key={index} className={styles.post}>
              <h2 className={styles.postTitle}>
                <Link href={`/blog/${post.slug}`}>
                  <a>{post.title}</a>
                </Link>
              </h2>
              <div className={styles.postMeta}>
                <time>{post.date}</time>
              </div>
              <p className={styles.postExcerpt}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`}>
                <a className={styles.readMore}>Read More &rarr;</a>
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.subscribe}>
          <h2>Subscribe to Our Newsletter</h2>
          <p>
            Get the latest news and updates about Next-Lite delivered directly to your inbox.
          </p>
          <form className={styles.subscribeForm}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.subscribeInput}
              required
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
