import { NextApiRequest, NextApiResponse } from 'next-lite-framework';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const response = await fetch(`${process.env.API_URL}/posts/${id}`);
        
        if (!response.ok) {
          return res.status(response.status).json({ error: 'Post not found' });
        }
        
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
      }
      break;
      
    case 'PUT':
      try {
        const { title, body } = req.body;
        
        if (!title || !body) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const response = await fetch(`${process.env.API_URL}/posts/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, body, id })
        });
        
        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
      }
      break;
      
    case 'DELETE':
      try {
        const response = await fetch(`${process.env.API_URL}/posts/${id}`, {
          method: 'DELETE'
        });
        
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
