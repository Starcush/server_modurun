import { getConnection } from 'typeorm';
import Track from '../entity/Track';
import UserTrack from '../entity/UserTrack';
import Rate from '../entity/Rate';

export default {
  getTrackById: async (trackId: number) => {
    const resultTrack = await getConnection()
      .getRepository(Track)
      .createQueryBuilder('track')
      .where('track.id = :id', { id: trackId })
      .getOne();
    if (resultTrack) {
      const response = {
        trackTitle: resultTrack.trackTitle,
        origin: resultTrack.origin,
        destination: resultTrack.destination,
        route: resultTrack.route,
        trackLength: resultTrack.trackLength,
      };
      return response;
    }
    return null;
  },
  deleteTrackById: async (trackId: string) => {
    const response = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Track)
      .where('trackTitle = :title', { title: trackId })
      .execute();
    return response;
  },
  insertTrackToDB: async (track: Track) => {
    const response = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Track)
      .values(track)
      .execute();
    return response;
  },
  getUsersTrackById: async (userId: number) => {
    const findresult = await getConnection()
      .query(`SELECT a_ut.*,rate.rateValue
              FROM
              (
                SELECT ut.*,track.origin,track.destination,track.trackTitle,track.route
                FROM user_track as ut
                LEFT JOIN track ON track.id = ut.trackId
                WHERE (ut.userId = ${userId})
              ) a_ut
              LEFT JOIN rate ON rate.trackId = a_ut.trackId AND rate.userId = a_ut.userId
              `);
    if (findresult.length) {
      const responseFormat = findresult.map((ele: any) => ({
        trackTitle: ele.trackTitle,
        origin: ele.origin,
        destination: ele.destination,
        route: ele.route,
        trackLength: ele.trackLength,
        rate: ele.rateValue,
      }));
      return responseFormat;
    }
    return null;
  },
  deleteUsersTrackById: async (userId: number, trackId: number) => {
    const response = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserTrack)
      .where('trackid = :trackid', { trackid: trackId })
      .andWhere('userid = :userid', { userid: userId })
      .execute();
    return response;
  },
  patchUsersTrackById: async (userId: number, trackId: number) => {
    const response = await getConnection()
      .createQueryBuilder()
      .update(UserTrack)
      .set({
        bookmark: () => '!bookmark',
      })
      .where('trackid = :trackid', { trackid: trackId })
      .andWhere('userid = :userid', { userid: userId })
      .execute();
    return response;
  },
  insertUsersTrackToDB: async (userId: any, trackId: any) => {
    const response = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(UserTrack)
      .values([{
        bookmark: false,
        user: userId,
        track: trackId,
      }])
      .execute();
    return response;
  },
  insertRateToDB: async (userId: any, trackId: any, rateValue: number) => {
    const response = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Rate)
      .values([{
        rateValue,
        user: userId,
        track: trackId,
      }])
      .execute();
    return response;
  },
  findUserTracks: async (userId: any, trackId: any) => {
    const response = await getConnection()
      .getRepository(UserTrack)
      .find({ where: { user: userId, track: trackId } });
    return response;
  },
  findRateTracks: async (userId: any, trackId: any) => {
    const response = await getConnection()
      .getRepository(Rate)
      .find({ where: { user: userId, track: trackId } });
    return response;
  },
};
