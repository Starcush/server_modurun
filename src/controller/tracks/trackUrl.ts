import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import Track from '../../entity/Track';

export default {
  post: async (req: Request, res: Response) => {
    const {
      trackTitle, origin, destination, route, trackLength,
    } = req.body;
    getConnection()
      .createQueryBuilder()
      .insert()
      .into(Track)
      .values([{
        trackTitle,
        origin,
        destination,
        route,
        trackLength,
      }])
      .execute();
    res.send(200);
  },
  get: async (req: Request, res: Response) => {
    const { trackid } = req.params;
    try {
      const resultTrack = await getConnection()
        .getRepository(Track)
        .createQueryBuilder('track')
        .where('track.id = :id', { id: trackid })
        .getOne();
      if (resultTrack) {
        const result = {
          trackTitle: resultTrack.trackTitle,
          origin: resultTrack.origin,
          destination: resultTrack.destination,
          route: resultTrack.route,
          trackLength: resultTrack.trackLength,
        };
        res.status(200).json(result);
      } else {
        res.send(404);
      }
    } catch (error) {
      console.error(error);
      res.send(500);
    }
  },
  delete: async (req: Request, res: Response) => {
    const { trackid } = req.params;
    const result = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Track)
      .where('trackTitle = :title', { title: trackid })
      .execute();
    if (result.affected > 0) {
      res.send(200);
    } else {
      res.send(204);
    }
  },
};
