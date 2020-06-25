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

export default {
  /*
  * 트렉 유틸
  */
  filterDistance: (track: any[], distance, userPosition) => track.filter((ele) => {
    const origin = JSON.parse(ele.origin);
    return distance > distanceFrom([origin, userPosition]) * 1000;
  }),

  filterArea: (track: any[], area) => track.filter((ele: { origin: string; }) => {
    const origin = JSON.parse(ele.origin);
    return (area.latitude > origin.latitude
      && ((area.latitude + area.latitudeDelta) < origin.latitude))
      && (area.longitude < origin.longitude
        && ((area.longitude + area.longitudeDelta) > origin.longitude));
  }),

  filterLength: (track: any[], length) => track.filter((ele) => ele.trackLength < length),

  /*
  * 스케줄 유틸
  */
  filterDistanceSch: (schedule: any[], distance, userPosition) => schedule.filter((ele) => {
    const origin = JSON.parse(ele.track.origin);
    return distance > distanceFrom([origin, userPosition]) * 1000;
  }),

  filterLengthSch: (schedule: any[], length) => schedule.filter((ele) => ele.track.trackLength < length),

  filterAreaSch: (schedule: any[], area) => schedule.filter((ele) => {
    const origin = JSON.parse(ele.track.origin);
    return (area.latitude < origin.latitude
      && ((area.latitude + area.latitudeDelta) > origin.latitude))
      && (area.longitude < origin.longitude
        && ((area.longitude + area.longitudeDelta) > origin.longitude));
  }),

  filterDateSch: (schedule: any[], date) => schedule.filter((ele) => {
    const eleFrom = new Date(ele.scheduleFrom);
    const eleTo = new Date(ele.scheduleTo);
    const filterFrom = new Date(date.from);
    const filterTo = new Date(date.to);

    return (filterFrom <= eleFrom) && (eleTo <= filterTo);
  }),
  filterTimeSch: (schedule: any[], date) => schedule.filter((ele) => {
    console.log(date);
    const filterTimeFromHour = new Date(date.timeFrom).getHours();
    const filterTimeFromMinutes = new Date(date.timeFrom).getMinutes();

    const filterTimeToHour = new Date(date.timeTo).getHours();
    const filterTimeToMinutes = new Date(date.timeTo).getMinutes();

    const eleTimeFromHour = new Date(ele.scheduleFrom).getHours();
    const eleTimeFromMinutes = new Date(ele.scheduleFrom).getMinutes();

    const eleTimeToHour = new Date(ele.scheduleTo).getHours();
    const eleTimeToMinutes = new Date(ele.scheduleTo).getMinutes();
    const filterTimeFromMin = filterTimeFromHour * 60 + filterTimeFromMinutes;
    const filterTimeToMin = filterTimeToHour * 60 + filterTimeToMinutes;

    const eleTimeFromMin = eleTimeFromHour * 60 + eleTimeFromMinutes;
    const eleTimeToMin = eleTimeToHour * 60 + eleTimeToMinutes;

    return (filterTimeFromMin <= eleTimeFromMin) && (eleTimeToMin <= filterTimeToMin);
  }),
};
