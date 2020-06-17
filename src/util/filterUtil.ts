/* eslint-disable no-restricted-properties */
/* eslint-disable import/prefer-default-export */
import { getConnection } from 'typeorm';
import { filterDistance, filterArea, filterLength } from './distanceUtil';

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

// eslint-disable-next-line max-len
export const getQuery = async (filter: filterType, userPosition: userPositionType, area: areaType, userId) => {
  // if (filter.rate) {
  //   let tracks = await getConnection()
  //     .query(`
  //             SELECT rate_join.*,user_track.bookmark
  //             FROM
  //             (SELECT id,trackTitle,origin,destination,route,rate
  //             FROM
  //             (SELECT rate.trackId,AVG(rate.rateValue) AS rate
  //             FROM rate
  //             GROUP BY rate.trackId) test
  //             RIGHT JOIN track ON track.id = test.trackId
  //             WHERE trackLength < ${filter.maxLength}) rate_join
  //             LEFT JOIN user_track ON rate_join.id = user_track.trackId
  //             WHERE user_track.userId=1
  //             ORDER BY rate DESC
  //             `);
  //   if (tracks.length !== 0) {
  //     if (filter.distance > 0) {
  //       tracks = filterDistance(tracks, filter.distance, userPosition);
  //     }
  //     tracks = filterArea(tracks, area);
  //   }
  //   const responseFormat = tracks.map((ele) => ({
  //     trackTitle: ele.trackTitle,
  //     origin: ele.origin,
  //     destination: ele.destination,
  //     route: ele.route,
  //     trackLength: ele.trackLength,
  //     rate: ele.rate,
  //     bookmark: Boolean(ele.bookmark),
  //   }));
  //   return responseFormat;
  // }
  // let queryBuilder = await getConnection()
  //   .getRepository(Track)
  //   .createQueryBuilder('track')
  //   .leftJoinAndSelect('track.userTracks', 'user_track', 'user_track.userId = :id', { id: 1 });
  // if (filter.maxLength > 0) {
  //   queryBuilder = queryBuilder.andWhere('track.trackLength < :maxLength', { maxLength: filter.maxLength });
  // }
  // if (filter.recent) {
  //   queryBuilder = queryBuilder.orderBy('track.createdAt', 'DESC');
  // }
  // let tracks = await queryBuilder.getMany();
  // if (tracks.length !== 0) {
  //   if (filter.distance > 0) {
  //     tracks = filterDistance(tracks, filter.distance, userPosition);
  //   }
  //   tracks = filterArea(tracks, area);
  // }
  // return tracks;
  let queryString = `
              SELECT rate_join.*,ut.bookmark
              FROM
              (SELECT id,trackTitle,origin,destination,trackLength,route,rate
              FROM
              (SELECT rate.trackId,AVG(rate.rateValue) AS rate
              FROM rate
              GROUP BY rate.trackId) rateGroup
              RIGHT JOIN track ON track.id = rateGroup.trackId
              ) rate_join
              LEFT JOIN (
              SELECT * 
              FROM user_track WHERE userId = ${userId}) ut ON rate_join.id = ut.trackId
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
};
