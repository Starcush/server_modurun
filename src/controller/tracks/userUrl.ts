import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import UserTrack from '../../entity/UserTrack';

export default {
  post: async (req: Request, res: Response) => {
    const {
      trackId, userId,
    } = req.body;
    const userTrackRepo = await getConnection().getRepository(UserTrack);
    const findresult = await userTrackRepo.find({ where: { user: userId, track: trackId } });
    if (!findresult.length) {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserTrack)
        .values([{
          bookmark: false,
          user: userId,
          track: trackId,
        }])
        .execute();
      if (result.identifiers.length > 0) {
        res.send(200);
      } else {
        res.send(204);
      }
    } else {
      res.send(409);
    }
  },
  delete: async (req: Request, res: Response) => {
    const {
      trackId, userId,
    } = req.body;
    const result = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserTrack)
      .where('trackid = :trackid', { trackid: trackId })
      .andWhere('userid = :userid', { userid: userId })
      .execute();
    if (result.affected > 0) {
      res.send(200);
    } else {
      res.send(404);
    }
  },
  patch: async (req: Request, res: Response) => {
    const {
      trackId, userId,
    } = req.body;
    const result = await getConnection()
      .createQueryBuilder()
      .update(UserTrack)
      .set({
        bookmark: () => '!bookmark',
      })
      .where('trackid = :trackid', { trackid: trackId })
      .andWhere('userid = :userid', { userid: userId })
      .execute();
    if (result.affected > 0) {
      res.send(200);
    } else {
      res.send(400);
    }
  },
  get: async (req: Request, res: Response) => {
    /*
    TODO
    * 유저의 아이디를 원래는 토큰으로 받지만 url파라미터를 받아서 임의로 구현
     */
    res.send(200);
  },
  postRate: async (req: Request, res: Response) => {
    /*
    TODO
    * 트랙의 아이디와 rate를 받아서 usertrack에 저장한다.
     */
    res.send(200);
  },
};
