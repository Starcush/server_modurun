// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import trackRepository from '../../repository/trackRepository';
import userUtil from '../../util/userUtil';

export default {
  post: async (req, res: Response) => {
    const userInfo: any = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    const { userId } = userInfo;
    const {
      trackId,
    } = req.body;
    const userTrack = await trackRepository.findUserTracks(userId, trackId);
    if (!userTrack.length) {
      const result = await trackRepository.insertUsersTrackToDB(userId, trackId);
      if (result.identifiers.length > 0) {
        res.send(200);
      } else {
        res.send(404);
      }
    } else {
      res.send(409);
    }
  },
  delete: async (req, res: Response) => {
    const userInfo: any = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    const { userId } = userInfo;
    const {
      trackId,
    } = req.body;
    const result = await trackRepository.deleteUsersTrackById(userId, trackId);
    if (result.affected > 0) {
      res.send(200);
    } else {
      res.send(404);
    }
  },
  patch: async (req, res: Response) => {
    const userInfo: any = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    const { userId } = userInfo;
    const {
      trackId,
    } = req.body;
    const result = await trackRepository.patchUsersTrackById(userId, trackId);
    if (result.affected > 0) {
      res.send(200);
    } else {
      res.send(400);
    }
  },
  get: async (req, res: Response) => {
    const userInfo: any = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    const { userId } = userInfo;
    const result = await trackRepository.getUsersTrackById(Number(userId));
    if (result) {
      res.status(200).json(result);
    } else {
      res.send(404);
    }
  },
  postRate: async (req, res: Response) => {
    const userInfo: any = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    const { userId } = userInfo;
    const {
      trackId, rate,
    } = req.body;
    const rateTrack = await trackRepository.findRateTracks(userId, trackId);
    if (!rateTrack.length) {
      const result = await trackRepository.insertRateToDB(userId, trackId, Number(rate));
      if (result.identifiers.length > 0) {
        res.send(200);
      } else {
        res.send(404);
      }
    } else {
      res.send(409);
    }
  },
};
