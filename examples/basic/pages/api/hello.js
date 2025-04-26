import { createApiHandler } from 'next-lite-framework';

export default createApiHandler((req, res) => {
  res.status(200).json({ 
    message: 'Hello from Next-Lite API!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
});
