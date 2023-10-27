import { getListener } from "@ft_transcendence/backend";
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise(async (resolve) => {
    const listener = await getListener();
    listener(req, res);
    res.on("finish", resolve);
  });

export default handler;
