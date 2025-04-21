import React from 'react';
import styles from '../styles/PostCard.module.css';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    date: string;
  };
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <h2 className={styles.title}>{post.title}</h2>
      <time className={styles.date}>{post.date}</time>
      <p className={styles.excerpt}>{post.excerpt}</p>
      <div className={styles.readMore}>Read more →</div>
    </div>
  );
}
