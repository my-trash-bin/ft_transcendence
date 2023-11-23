// TODO: remove this before submit

import httpProxy from 'http-proxy';
import { RequestHandler } from 'next/dist/server/next';

const API_ENDPOINT = 'http://localhost:60080';

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default <RequestHandler>((req, res) => {
  return new Promise((resolve, reject) => {
    proxy.web(req, res, { target: API_ENDPOINT, changeOrigin: true }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
});
