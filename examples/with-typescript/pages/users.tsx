import Head from 'next-lite-framework/head';
import Link from 'next-lite-framework/link';
import styles from '../styles/Home.module.css';
import { NextPage } from 'next-lite-framework/types';
import { UserResponse } from '../types/user';
import { useEffect, useState } from 'react';

const Users: NextPage = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: UserResponse[] = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Users - Next-Lite TypeScript Example</title>
        <meta name="description" content="Users page with TypeScript" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Users</h1>

        <p className={styles.description}>
          This page demonstrates type-safe data fetching
        </p>

        <div className={styles.userList}>
          {loading && <p>Loading users...</p>}
          {error && <p className={styles.error}>Error: {error}</p>}
          
          {!loading && !error && (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        <div className={styles.backToHome}>
          <Link href="/">
            &larr; Back to home
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/Nom-nom-hub/next-lite-main"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Next-Lite
        </a>
      </footer>
    </div>
  );
};

export default Users;
