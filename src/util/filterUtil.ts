/* eslint-disable import/prefer-default-export */
import { getConnection } from 'typeorm';
import Track from '../entity/Track';

function distanceFrom(points: any): number {
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
  // eslint-disable-next-line no-restricted-properties
  const a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
  const distance = earthRadius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
  return Number(distance.toFixed(3));
}

export const getQuery = async (filter: any, userPosition: any, area: any) => {
  let queryBuilder = await getConnection().getRepository(Track).createQueryBuilder('track');
  if (filter.maxLength > 0) {
    queryBuilder = queryBuilder.andWhere('track.trackLength < :maxLength', { maxLength: filter.maxLength });
  }
  if (filter.rate) {
    queryBuilder = queryBuilder.leftJoinAndSelect('track.rates', 'rate');
  }
  if (filter.recent) {
    queryBuilder = queryBuilder.orderBy('createdAt', 'DESC');
    let temp = await queryBuilder.getMany();
    // console.dir(temp);
  }
  let tracks = await queryBuilder.getMany();
  if (tracks.length !== 0) {
    /*
      TODO
     * userposition 과 area를 이용해서 필터링 구현
     // * userposition필터링 구현
     * area필터링
    */
    if (filter.distance > 0) {
      tracks = tracks.filter((ele) => {
        const origin = JSON.parse(ele.origin);
        return filter.distance > distanceFrom([origin, userPosition]) * 1000;
      });
    }
  }
  return tracks;
};
