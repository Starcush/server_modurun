/* eslint-disable no-await-in-loop */
import { getConnection, ConnectionOptionsReader } from 'typeorm';
import Schedule from '../entity/Schedule';
import UserSchedule from '../entity/UserSchedule';
import userScheduleRepository from './userScheduleRepository';
import trackRepository from './trackRepository';
import { filterDistanceSch, filterLengthSch, filterAreaSch, filterDateSch } from '../util/distanceUtil';
import * as cookieParser from 'cookie-parser';

export default {
  getScheduleUsers: async (schduleId) => {
    const response = await getConnection()
      .query(`SELECT *
    FROM schedule s RIGHT JOIN user_Schedule u ON s.id = u.scheduleId
    WHERE s.id = ${schduleId}
    ORDER BY u.createdAt DESC;`);
    return response;
  },
  insertSchedule: async (track, title, scheduleFrom, scheduleTo) => {
    const response = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Schedule)
      .values([
        {
          title, scheduleFrom, scheduleTo, track,
        },
      ])
      .execute();
    return response.generatedMaps[0].id;
  },
  insertUserSchedule: async (user, schedule) => {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(UserSchedule)
      .values([
        {
          user, schedule,
        },
      ])
      .execute();
  },
  deleteSchedule: async (scheduleId) => {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Schedule)
      .where('id = :id', { id: scheduleId })
      .execute();
  },
  getAllSchedule: async (filter, userposition, area, userId) => {
    // 모든 스케줄의 정보를 가져온다
    const allSchedules = await getConnection().query('SELECT * FROM schedule ORDER BY createdAt DESC');
    let result = [];
    for (let i = 0; i < allSchedules.length; i += 1) {
      const userjoined = await userScheduleRepository.isUserSchedule(userId, allSchedules[i].id);
      const track = await trackRepository.getTrackById(allSchedules[i].trackId, userId);
      result.push({ ...allSchedules[i], userjoined, track: track[0] });
    }
    if (result.length !== 0) {
      if (filter.maxLength > 0) {
        result = filterLengthSch(result, filter.maxLength);
      }
      if (filter.distance > 0) {
        result = filterDistanceSch(result, filter.distance, userposition);
      }
      if (filter.rate) {
        result.sort((a, b) => Number(b.track.rate) - Number(a.track.rate));
      }
      result = filterAreaSch(result, area);
      result = filterDateSch(result, filter.date);
    }
    return result;
  },
};
