/* eslint-disable max-len */
/* eslint-disable no-restricted-properties */
type gelocation = {
  latitude: number,
  longitude: number
}
type points = gelocation[];

function distanceFrom(points: points): number {
  const lat1 = points[0].latitude;
  const radianLat1 = lat1 * (Math.PI / 180);
  const lng1 = points[0].longitude;
  const radianLng1 = lng1 * (Math.PI / 180);
  const lat2 = points[1].latitude;
  const radianLat2 = lat2 * (Math.PI / 180);
  const lng2 = points[1].longitude;
  const radianLng2 = lng2 * (Math.PI / 180);
  const earthRadius = 6371;
  const diffLat = (radianLat1 - radianLat2);
  const diffLng = (radianLng1 - radianLng2);
  const sinLat = Math.sin(diffLat / 2);
  const sinLng = Math.sin(diffLng / 2);
  const a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
  const distance = earthRadius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
  return Number(distance.toFixed(3));
}

export const filterDistance = (track: any[], distance, userPosition) => track.filter((ele) => {
  const origin = JSON.parse(ele.origin);
  return distance > distanceFrom([origin, userPosition]) * 1000;
});

export const filterArea = (track: any[], area) => track.filter((ele: { origin: string; }) => {
  const origin = JSON.parse(ele.origin);
  return (area.latitude > origin.latitude
    && ((area.latitude + area.latitudeDelta) < origin.latitude))
    && (area.longitude < origin.longitude
      && ((area.longitude + area.longitudeDelta) > origin.longitude));
});


export const filterLength = (track: any[], length) => track.filter((ele) => ele.trackLength < length);
