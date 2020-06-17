// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';

export default {
  post: async (req: Request, res: Response) => {
    res.send(200);
  },
  get: async (req: Request, res: Response) => {
    res.send(200);
  },
  delete: async (req: Request, res: Response) => {
    res.send(200);
  },
};
