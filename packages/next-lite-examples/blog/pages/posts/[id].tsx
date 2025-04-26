import React from 'react';
import { Head, Link } from 'next-lite-framework';
import styles from '../../styles/Post.module.css';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  website: string;
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

interface PostPageProps {
  post: Post;
  user: User;
  comments: Comment[];
}

export default function PostPage({ post, user, comments }: PostPageProps) {
  if (!post) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Post Not Found | Next-Lite Blog</title>
        </Head>
        <main className={styles.main}>
          <h1>Post Not Found</h1>
          <Link href="/" className={styles.backLink}>
            &larr; Back to Home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{post.title} | Next-Lite Blog</title>
        <meta name="description" content={post.body.substring(0, 160)} />
      </Head>

      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          &larr; Back to Home
        </Link>

        <article className={styles.post}>
          <h1 className={styles.title}>{post.title}</h1>
          
          <div className={styles.author}>
            <h3>Author: {user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Website: {user.website}</p>
          </div>
          
          <div className={styles.content}>
            {post.body.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        <section className={styles.comments}>
          <h2>Comments ({comments.length})</h2>
          
          {comments.map(comment => (
            <div key={comment.id} className={styles.comment}>
              <h3>{comment.name}</h3>
              <p className={styles.commentEmail}>{comment.email}</p>
              <p>{comment.body}</p>
            </div>
          ))}
        </section>
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

export async function getStaticPaths() {
  try {
    const res = await fetch(`${process.env.API_URL}/posts`);
    const posts = await res.json();

    const paths = posts.slice(0, 10).map((post: Post) => ({
      params: { id: post.id.toString() }
    }));

    return {
      paths,
      fallback: 'blocking'
    };
  } catch (error) {
    console.error('Error fetching posts for paths:', error);
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  try {
    const [postRes, commentsRes] = await Promise.all([
      fetch(`${process.env.API_URL}/posts/${params.id}`),
      fetch(`${process.env.API_URL}/posts/${params.id}/comments`)
    ]);

    const post = await postRes.json();
    const comments = await commentsRes.json();

    // Fetch user data
    const userRes = await fetch(`${process.env.API_URL}/users/${post.userId}`);
    const user = await userRes.json();

    return {
      props: {
        post,
        user,
        comments
      },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error fetching post data:', error);
    return {
      notFound: true
    };
  }
}
