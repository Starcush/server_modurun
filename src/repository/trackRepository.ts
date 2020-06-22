import { getConnection } from 'typeorm';
import Track from '../entity/Track';
import UserTrack from '../entity/UserTrack';
import Rate from '../entity/Rate';
import distanceUtil from '../util/distanceUtil';

type gelocation = {
  latitude: number,
  longitude: number
}
type points = gelocation[];
interface filterType {
  maxLength: number,
  distance: number,
  rate: boolean,
  recent: boolean,
}
interface userPositionType {
  latitude: number,
  longitude: number,
}
interface areaType {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
}

export default {
  getTracks: async (filter: filterType, userPosition: userPositionType, area: areaType, userId) => {
    let queryString = `
              SELECT track.*,user_track.bookmark,
              (
                SELECT AVG(rate.rateValue)
                FROM rate
                WHERE rate.trackId =track.id
              )as rateValue
              FROM track
              LEFT JOIN user_track ON track.id = user_track.trackId AND user_track.userId = ${userId}
              `;
    if (filter.rate) {
      queryString += 'ORDER BY rate DESC';
    }

    let tracks = await getConnection()
      .query(queryString);
    if (tracks.length !== 0) {
      if (filter.maxLength > 0) {
        tracks = distanceUtil.filterLength(tracks, filter.maxLength);
      }
      if (filter.distance > 0) {
        tracks = distanceUtil.filterDistance(tracks, filter.distance, userPosition);
      }
      tracks = distanceUtil.filterArea(tracks, area);
    }
    return tracks;
  },
  getTrackById: async (trackId: number, userId: number) => {
    const resultTrack = await getConnection()
      .query(`
              SELECT track.*,user_track.bookmark,
              (
                SELECT AVG(rate.rateValue)
                FROM rate
                WHERE rate.trackId =track.id
              )as rateValue
              FROM track
              LEFT JOIN user_track ON track.id = user_track.trackId AND user_track.userId = ${userId}
              WHERE track.id = ${trackId}
              `);
    return resultTrack;
  },
  deleteTrackById: async (trackId: string) => {
    const response = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Track)
      .where('id = :id', { id: trackId })
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
      return findresult;
    }
    return null;
  },
  deleteUsersTrackById: async (userId: number, trackId: number) => {
    const response = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserTrack)
      .where('trackId = :trackid', { trackid: trackId })
      .andWhere('userId = :userid', { userid: userId })
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
