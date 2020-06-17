/* eslint-disable import/prefer-default-export */

export const ScheduleSeed = [
  {
    title: '오늘 공원 한바퀴',
    scheduleFrom: new Date((new Date()).valueOf() + 1000 * 3600 * 1),
    scheduleTo: new Date((new Date()).valueOf() + 1000 * 3600 * 2),
    track: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '내일 공원 두바퀴',
    scheduleFrom: new Date((new Date()).valueOf() + 1000 * 3600 * 25),
    scheduleTo: new Date((new Date()).valueOf() + 1000 * 3600 * 26),
    track: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: '모레 공원 세바퀴',
    scheduleFrom: new Date((new Date()).valueOf() + 1000 * 3600 * 49),
    scheduleTo: new Date((new Date()).valueOf() + 1000 * 3600 * 50),
    track: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
