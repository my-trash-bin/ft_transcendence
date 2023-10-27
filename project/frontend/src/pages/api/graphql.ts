import { getGraphQLListener } from '@ft_transcendence/backend';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise(async (resolve) => {
    const listener = await getGraphQLListener();
    listener(req, res);
    res.on('finish', resolve);
  });

export default handler;
