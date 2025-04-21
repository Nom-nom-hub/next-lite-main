import React from 'react';
import { useRouter } from '../router';
import styles from '../styles/Home.module.css';
import { PostCard } from '../components/PostCard';
import { getAllPosts } from '../lib/posts';

interface HomePageProps {
  posts: Array<{
    id: string;
    title: string;
    excerpt: string;
    date: string;
  }>;
}

export default function HomePage({ posts }: HomePageProps) {
  const router = useRouter();
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Blog</h1>
        <p className={styles.description}>
          A simple blog built with Next-Lite
        </p>
      </header>
      
      <main className={styles.main}>
        <div className={styles.grid}>
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => router.navigate(`/posts/${post.id}`)}
            />
          ))}
        </div>
      </main>
      
      <footer className={styles.footer}>
        <p>Powered by Next-Lite</p>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  
  return {
    props: {
      posts,
    },
  };
}
