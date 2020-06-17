// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import Track from '../../entity/Track';
import trackRepository from '../../repository/trackRepository';
import userUtil from '../../util/userUtil';

export default {
  post: async (req: Request, res: Response) => {
    const {
      trackTitle, origin, destination, route, trackLength,
    } = req.body;
    const newTrack = new Track();
    newTrack.trackTitle = trackTitle;
    newTrack.origin = JSON.stringify(origin);
    newTrack.destination = JSON.stringify(destination);
    newTrack.route = JSON.stringify(route);
    newTrack.trackLength = trackLength;
    await trackRepository.insertTrackToDB(newTrack);
    res.send(200);
  },
  get: async (req, res: Response) => {
    const { trackid } = req.params;
    const userInfo: any = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    const { userId } = userInfo;
    try {
      const result = await trackRepository.getTrackById(Number(trackid), userId);
      if (result) {
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
    try {
      const result = await trackRepository.deleteTrackById(trackid);
      if (result.affected > 0) {
        res.send(200);
      } else {
        res.send(404);
      }
    } catch (error) {
      console.error(error);
      res.send(500);
    }
  },
};
