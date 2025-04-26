import { NextApiRequest, NextApiResponse } from 'next-lite-framework/types';
import { createApiHandler } from 'next-lite-framework';

type Data = {
  name: string;
};

export default createApiHandler((req: NextApiRequest, res: NextApiResponse<Data>) => {
  res.status(200).json({ name: 'John Doe' });
});
