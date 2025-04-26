import React from 'react';
import { Head, Link } from 'next-lite-framework';
import styles from '../styles/Home.module.css';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface HomeProps {
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next-Lite Blog</title>
        <meta name="description" content="A simple blog built with Next-Lite" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.highlight}>Next-Lite Blog</span>
        </h1>

        <p className={styles.description}>
          A simple blog example built with Next-Lite Framework
        </p>

        <div className={styles.grid}>
          {posts.map(post => (
            <Link key={post.id} href={`/posts/${post.id}`} className={styles.card}>
              <h2>{post.title}</h2>
              <p>{post.body.substring(0, 100)}...</p>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/next-lite/next-lite"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Next-Lite
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const res = await fetch(`${process.env.API_URL}/posts`);
    const posts = await res.json();

    return {
      props: {
        posts: posts.slice(0, 10)
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: {
        posts: []
      }
    };
  }
}
