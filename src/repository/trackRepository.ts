import { getConnection } from 'typeorm';
import Track from '../entity/Track';
import UserTrack from '../entity/UserTrack';
import Rate from '../entity/Rate';
import { filterLength, filterDistance, filterArea } from '../util/distanceUtil';

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
              SELECT rate_join.*,ut.bookmark
              FROM
              (
                SELECT id,trackTitle,origin,destination,trackLength,route,rate
                FROM
                (
                  SELECT rate.trackId,AVG(rate.rateValue) AS rate
                  FROM rate
                  GROUP BY rate.trackId
                ) rateGroup
                RIGHT JOIN track ON track.id = rateGroup.trackId
              ) rate_join
              LEFT JOIN 
              (
                SELECT * 
                FROM user_track WHERE userId = ${userId}
              ) ut ON rate_join.id = ut.trackId
              `;
    if (filter.rate) {
      queryString += 'ORDER BY rate DESC';
    }

    let tracks = await getConnection()
      .query(queryString);
    if (tracks.length !== 0) {
      if (filter.maxLength > 0) {
        tracks = filterLength(tracks, filter.maxLength);
      }
      if (filter.distance > 0) {
        tracks = filterDistance(tracks, filter.distance, userPosition);
      }
      tracks = filterArea(tracks, area);
    }
    const responseFormat = tracks.map((ele) => ({
      trackTitle: ele.trackTitle,
      origin: ele.origin,
      destination: ele.destination,
      route: ele.route,
      trackLength: ele.trackLength,
      rate: ele.rate,
      bookmark: Boolean(ele.bookmark),
    }));
    return responseFormat;
  },
  getTrackById: async (trackId: number, userId: number) => {
    const resultTrack = await getConnection()
      .query(`
              SELECT track.*,ut.bookmark
              FROM
              (SELECT user_track.bookmark,user_track.trackId
              FROM user_track
              WHERE user_track.userId = ${userId}) ut
              RIGHT JOIN track ON track.id = ut.trackId
              WHERE track.id = ${trackId}
              `);
    if (resultTrack.length) {
      return resultTrack;
    }
    return [];
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
      const responseFormat = findresult.map((ele: any) => ({
        trackTitle: ele.trackTitle,
        origin: ele.origin,
        destination: ele.destination,
        route: ele.route,
        trackLength: ele.trackLength,
        rate: ele.rateValue,
        bookmark: Boolean(ele.bookmark),
      }));
      return responseFormat;
    }
    return null;
  },
  deleteUsersTrackById: async (userId: number, trackId: number) => {
    console.log(`${trackId},${userId}`);
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
