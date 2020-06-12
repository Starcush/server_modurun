/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
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
let beforeLength = [
  {
    trackTitle: '동탄순환대로24',
    origin: `{
            "latitude": 37.205945,
            "longitude": 127.111646
          }`,
    destination: `{
            "latitude": 37.204731,
            "longitude": 127.116066
          }`,
    route: `[
  {
    "latitude": 37.205945,
    "longitude": 127.111646
  },
  {
    "latitude": 37.204552,
    "longitude": 127.112794
  },
  {
    "latitude": 37.204731,
    "longitude": 127.116066
  }
]`,
  },
  {
    trackTitle: '동탄치동천로, 84',
    origin: `{
            "latitude": 37.203400,
            "longitude": 127.110665
          }`,
    destination: `{
            "latitude": 37.203726,
            "longitude": 127.116048
          }`,
    route: `[
  {
    "latitude": 37.205945,
    "longitude": 127.111646
  },
  {
    "latitude": 37.204731,
    "longitude": 127.116066
  }
]`,
  },
  {
    trackTitle: '동탄순환대로25길',
    origin: `{
            "latitude": 37.204078,
            "longitude": 127.110293
          }`,
    destination: `{
            "latitude": 37.203916,
            "longitude": 127.119885
          }`,
    route: `[
  {
    "latitude": 37.205945,
    "longitude": 127.111646
  },
  {
    "latitude": 37.204343,
    "longitude": 127.113221
  },
  {
    "latitude": 37.204731,
    "longitude": 127.116066
  }
]`,
  },
  {
    trackTitle: '동탄순환대로26길',
    origin: `{
            "latitude": 37.203536,
            "longitude": 127.117928
          }`,
    destination: `{
            "latitude": 37.203536,
            "longitude": 127.117928
          }`,
    route: `[
  {
    "latitude": 37.205945,
    "longitude": 127.111646
  },
  {
    "latitude": 37.204343,
    "longitude": 127.113221
  },
  {
    "latitude": 37.204731,
    "longitude": 127.116066
  }
]`,
  },
];

const addTrack = Array(100).fill({
  trackTitle: '동탄순환대로26길',
  origin: `{
            "latitude": 37.200651,
            "longitude": 127.027508
          }`,
  destination: `{
            "latitude": 37.203536,
            "longitude": 127.117928
          }`,
  route: `[
  {
    "latitude": 37.205945,
    "longitude": 127.111646
  },
  {
    "latitude": 37.204343,
    "longitude": 127.113221
  },
  {
    "latitude": 37.204731,
    "longitude": 127.116066
  }
]`,
}, 0, 100);
beforeLength = beforeLength.concat(addTrack);

export const TrackSeed = {
  makeFakeData: beforeLength.map((ele, idx) => ({
    trackTitle: ele.trackTitle,
    origin: ele.origin,
    destination: ele.destination,
    route: ele.route,
    trackLength: distanceFrom([JSON.parse(ele.origin), JSON.parse(ele.destination)]) * 1000,
    createdAt: `${new Date((new Date()).valueOf() + 1000 * 3600 * idx)}`,
    updatedAt: `${new Date((new Date()).valueOf() + 1000 * 3600 * idx)}`,
  })),
  test: beforeLength.map((ele) => ({
    trackTitle: ele.trackTitle,
    origin: ele.origin,
    destination: ele.destination,
    route: ele.route,
    trackLength: distanceFrom([JSON.parse(ele.origin), JSON.parse(ele.destination)]) * 1000,
  })),
};
