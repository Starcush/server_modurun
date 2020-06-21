/* eslint-disable max-len */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import trackRepository from '../../repository/trackRepository';
import userUtil from '../../util/userUtil';
import '../../env';

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
    try {
      const userTrack = await trackRepository.findUserTracks(userId || process.env.USER_ID, trackId);
      if (!userTrack.length) {
        const result = await trackRepository.insertUsersTrackToDB(userId || process.env.USER_ID, trackId);
        if (result.identifiers.length > 0) {
          res.send(200);
        } else {
          res.send(404);
        }
      } else {
        res.send(409);
      }
    } catch (error) {
      res.send(500);
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
    try {
      const result = await trackRepository.deleteUsersTrackById(userId || process.env.USER_ID, trackId);
      if (result.affected > 0) {
        res.send(200);
      } else {
        res.send(404);
      }
    } catch (error) {
      res.send(500);
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
    try {
      const result = await trackRepository.patchUsersTrackById(userId || process.env.USER_ID, trackId);
      if (result.affected > 0) {
        res.send(200);
      } else {
        res.send(400);
      }
    } catch (error) {
      res.send(500);
    }
  },
  get: async (req, res: Response) => {
    const userInfo: any = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    const { userId } = userInfo;
    try {
      const result = await trackRepository.getUsersTrackById(Number(userId || process.env.USER_ID));
      if (result) {
        res.status(200).json(result);
      } else {
        res.send(404);
      }
    } catch (error) {
      res.send(500);
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
    try {
      const rateTrack = await trackRepository.findRateTracks(userId || process.env.USER_ID, trackId);
      if (!rateTrack.length) {
        const result = await trackRepository.insertRateToDB(userId || process.env.USER_ID, trackId, Number(rate));
        if (result.identifiers.length > 0) {
          res.send(200);
        } else {
          res.send(404);
        }
      } else {
        res.send(409);
      }
    } catch (error) {
      res.send(500);
    }
  },
};
