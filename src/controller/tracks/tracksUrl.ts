import { Request, Response } from "express";
import { getQuery } from '../../util/filterUtil';

export default {
  get: async (req: Request, res: Response) => {
    const { filter, userposition, area } = req.params;
    const tracks = await getQuery(JSON.parse(filter), JSON.parse(userposition), JSON.parse(area));
    const responseFormat = tracks.map((ele) => ({
      trackTitle: ele.trackTitle,
      origin: ele.origin,
      destination: ele.destination,
      route: ele.route,
      trackLength: ele.trackLength,
    }));
    if (tracks.length > 0) {
      res.status(200).json(responseFormat);
    } else {
      res.send(404);
    }
  },
};
