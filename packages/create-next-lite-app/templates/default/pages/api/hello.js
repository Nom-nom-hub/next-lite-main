import { createApiHandler } from 'next-lite-framework';

export default createApiHandler((req, res) => {
  res.status(200).json({ name: 'John Doe' });
});
