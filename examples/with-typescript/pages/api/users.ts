import { NextApiRequest, NextApiResponse } from 'next-lite-framework/types';
import { createApiHandler } from 'next-lite-framework';
import { UserResponse } from '../../types/user';

// Mock data
const users: UserResponse[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'visitor' }
];

export default createApiHandler((req: NextApiRequest, res: NextApiResponse<UserResponse[] | { error: string }>) => {
  if (req.method === 'GET') {
    // Simulate a slight delay to show loading state
    setTimeout(() => {
      res.status(200).json(users);
    }, 500);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
});
