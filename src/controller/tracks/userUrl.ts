import { Request, Response } from 'express';
import { getConnection, createQueryBuilder } from 'typeorm';
import UserTrack from '../../entity/UserTrack';
import Rate from '../../entity/Rate';
import Track from '../../entity/Track';

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
    const {
      userId,
    } = req.params;
    // const rateRepo = await getConnection().getRepository(Rate);
    // const findresult = await rateRepo.find({
    //   join: {
    //     alias: 'rate',
    //     leftJoinAndSelect: {
    //       track: 'rate.track',
    //     },
    //   },
    //   where: {
    //     user: userId,
    //   },
    // });
    const findresult = await getConnection().getRepository(Rate).createQueryBuilder('rate')
      .leftJoinAndSelect('rate.track', 'track')
      .where('rate.user = :userid', { userid: userId })
      .getMany();
    if (findresult.length) {
      const responseFormat = findresult.map((ele: Rate) => ({
        trackTitle: ele.track.trackTitle,
        origin: ele.track.origin,
        destination: ele.track.destination,
        route: ele.track.route,
        trackLength: ele.track.trackLength,
      }));
      res.status(200).json(responseFormat);
    } else {
      res.send(404);
    }
  },
  postRate: async (req: Request, res: Response) => {
    /*
    TODO
    * 트랙의 아이디와 유저 아이디를 받아서 rate 테이블에 저장한다.
     */
    const {
      trackId, userId, rate,
    } = req.body;
    const rateTrackRepo = await getConnection().getRepository(Rate);
    const findresult = await rateTrackRepo.find({ where: { user: userId, track: trackId } });
    if (!findresult.length) {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Rate)
        .values([{
          rateValue: rate,
          user: userId,
          track: trackId,
        }])
        .execute();
      if (result.identifiers.length > 0) {
        res.send(200);
      } else {
        res.send(409);
      }
    } else {
      res.send(409);
    }
  },
};
