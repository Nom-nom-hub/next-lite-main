import React from 'react';
import { useRouter } from '../../router';
import styles from '../../styles/Post.module.css';
import { getPostById, getAllPosts } from '../../lib/posts';

interface PostPageProps {
  post: {
    id: string;
    title: string;
    content: string;
    date: string;
  };
}

export default function PostPage({ post }: PostPageProps) {
  const router = useRouter();
  
  if (!post) {
    return (
      <div className={styles.container}>
        <h1>Post not found</h1>
        <button onClick={() => router.navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={() => router.navigate('/')}
      >
        ← Back to Home
      </button>
      
      <article className={styles.post}>
        <header>
          <h1 className={styles.title}>{post.title}</h1>
          <time className={styles.date}>{post.date}</time>
        </header>
        
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}

export async function getStaticProps(context) {
  const { id } = context.params;
  const post = getPostById(id);
  
  if (!post) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();
  
  return {
    paths: posts.map(post => ({
      params: { id: post.id },
    })),
    fallback: false,
  };
}
