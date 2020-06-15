/* eslint-disable no-restricted-properties */
/* eslint-disable import/prefer-default-export */
import { getConnection } from 'typeorm';
import Track from '../entity/Track';

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

function distanceFrom(points: points): number {
  const lat1 = points[0].latitude;
  const radianLat1 = lat1 * (Math.PI / 180);
  const lng1 = points[0].longitude;
  const radianLng1 = lng1 * (Math.PI / 180);
  const lat2 = points[1].latitude;
  const radianLat2 = lat2 * (Math.PI / 180);
  const lng2 = points[1].longitude;
  const radianLng2 = lng2 * (Math.PI / 180);
  const earthRadius = 6371; // or 6371 for kilometers
  const diffLat = (radianLat1 - radianLat2);
  const diffLng = (radianLng1 - radianLng2);
  const sinLat = Math.sin(diffLat / 2);
  const sinLng = Math.sin(diffLng / 2);
  // eslint-disable-next-line max-len
  const a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
  const distance = earthRadius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
  return Number(distance.toFixed(3));
}

// eslint-disable-next-line max-len
export const getQuery = async (filter: filterType, userPosition: userPositionType, area: areaType) => {
  if (filter.rate) {
    let findresult = await getConnection()
      .query(`SELECT id,trackTitle,origin,destination,route,rate
              FROM
              (SELECT rate.trackId,AVG(rate.rateValue) AS rate
              FROM rate
              GROUP BY rate.trackId) test
              RIGHT JOIN track ON track.id = test.trackId
              WHERE trackLength < ${filter.maxLength}
              ORDER BY rate DESC
              `);
    if (findresult.length !== 0) {
      if (filter.distance > 0) {
        findresult = findresult.filter((ele) => {
          const origin = JSON.parse(ele.origin);
          return filter.distance > distanceFrom([origin, userPosition]) * 1000;
        });
      }
      findresult = findresult.filter((ele) => {
        const origin = JSON.parse(ele.origin);
        return (area.latitude > origin.latitude
          && ((area.latitude + area.latitudeDelta) < origin.latitude))
          && (area.longitude < origin.longitude
            && ((area.longitude + area.longitudeDelta) > origin.longitude));
      });
    }
    return findresult;
  }
  let queryBuilder = await getConnection().getRepository(Track).createQueryBuilder('track');
  if (filter.maxLength > 0) {
    queryBuilder = queryBuilder.andWhere('track.trackLength < :maxLength', { maxLength: filter.maxLength });
  }
  if (filter.recent) {
    queryBuilder = queryBuilder.orderBy('createdAt', 'DESC');
  }
  let tracks = await queryBuilder.getMany();
  if (tracks.length !== 0) {
    if (filter.distance > 0) {
      tracks = tracks.filter((ele) => {
        const origin = JSON.parse(ele.origin);
        return filter.distance > distanceFrom([origin, userPosition]) * 1000;
      });
    }
    tracks = tracks.filter((ele) => {
      const origin = JSON.parse(ele.origin);
      return (area.latitude > origin.latitude
        && ((area.latitude + area.latitudeDelta) < origin.latitude))
        && (area.longitude < origin.longitude
          && ((area.longitude + area.longitudeDelta) > origin.longitude));
    });
  }
  return tracks;
};
