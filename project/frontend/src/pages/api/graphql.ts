import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise(async (resolve) => {
    res.status(200).send("GraphQL API is currently working in progress");
    res.on("finish", resolve);
  });

export default handler;
