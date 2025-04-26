import { NextApiRequest, NextApiResponse } from 'next-lite-framework';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const response = await fetch(`${process.env.API_URL}/posts`);
        const data = await response.json();
        
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
      }
      break;
      
    case 'POST':
      try {
        const { title, body, userId } = req.body;
        
        if (!title || !body || !userId) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const response = await fetch(`${process.env.API_URL}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, body, userId })
        });
        
        const data = await response.json();
        res.status(201).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
