/* eslint-disable max-len */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import Track from '../../entity/Track';
import trackRepository from '../../repository/trackRepository';
import userUtil from '../../util/userUtil';
import '../../env';
import formatUtil from '../../util/formatUtil';

export default {
  post: async (req, res: Response) => {
    const {
      trackTitle, origin, destination, route, trackLength,
    } = req.body;
    try {
      const newTrack = new Track();
      newTrack.trackTitle = trackTitle;
      newTrack.origin = JSON.stringify(origin);
      newTrack.destination = JSON.stringify(destination);
      newTrack.route = JSON.stringify(route);
      newTrack.trackLength = trackLength;
      const resultTrack = await trackRepository.insertTrackToDB(newTrack);

      const userInfo: any = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
        if (err) return false;
        return decoded.data;
      });
      const { userId } = userInfo;
      trackRepository.insertUsersTrackToDB(userId || process.env.USER_ID, resultTrack.identifiers[0].id);
      res.send(200);
    } catch (error) {
      res.send(500);
    }
  },
  get: async (req, res: Response) => {
    const { trackid } = req.params;
    const userInfo: any = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    const { userId } = userInfo;
    try {
      const result = await trackRepository.getTrackById(Number(trackid), userId || process.env.USER_ID);
      if (result) {
        res.status(200).json(formatUtil.changeToJson(result));
      } else {
        res.send(404);
      }
    } catch (error) {
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
      res.send(500);
    }
  },
};
