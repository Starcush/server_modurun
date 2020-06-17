/* eslint-disable max-len */
import { Request, Response } from 'express';
import userUtil from '../../util/userUtil';
import trackRepository from '../../repository/trackRepository';

export default {
  get: async (req, res: Response) => {
    const userInfo: any = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    const { userId } = userInfo;
    const { filter, userposition, area } = req.params;

    const tracks = await trackRepository.getTracks(JSON.parse(filter), JSON.parse(userposition), JSON.parse(area), userId);
    if (tracks.length > 0) {
      res.status(200).json(tracks);
    } else {
      res.send(404);
    }
  },
};
