/* eslint-disable no-await-in-loop */
import { getConnection } from 'typeorm';
import Schedule from '../entity/Schedule';
import UserSchedule from '../entity/UserSchedule';
import userScheduleRepository from './userScheduleRepository';
import trackRepository from './trackRepository';
import distanceUtil from '../util/distanceUtil';

export default {
  getScheduleData: async (scheduleId) => {
    const response = await getConnection()
      .query(`SELECT s.title, t.trackLength, s.scheduleFrom, s.scheduleTo
      FROM schedule s RIGHT JOIN track t ON s.trackId = t.id
      WHERE s.id = ${scheduleId}`);
    return response;
  },
  getScheduleUsers: async (scheduleId) => {
    const response = await getConnection()
      .query(`SELECT *
    FROM schedule s RIGHT JOIN user_Schedule u ON s.id = u.scheduleId
    WHERE s.id = ${scheduleId}
    ORDER BY u.createdAt DESC;`);
    return response;
  },
  getCreatedScheduleData: async (scheduleId) => {
    const response = await getConnection()
      .query(`SELECT t.trackTitle, t.origin, t.destination, t.route, t.trackLength, s.title, s.scheduleFrom, s.scheduleTo
      FROM schedule s RIGHT JOIN track t ON s.trackId = t.id
      WHERE s.id = ${scheduleId};`);
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
    const response = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(UserSchedule)
      .values([
        {
          user, schedule,
        },
      ])
      .execute();
    return response;
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
      const participants = await userScheduleRepository.getParticipantsSchedule(allSchedules[i].id);
      const track = await trackRepository.getTrackById(allSchedules[i].trackId, userId);
      result.push({
        ...allSchedules[i],
        userjoined,
        participants,
        track: track[0],
      });
    }
    if (result.length !== 0) {
      if (filter.maxLength > 0) {
        result = distanceUtil.filterLengthSch(result, filter.maxLength);
      }
      if (filter.distance > 0) {
        result = distanceUtil.filterDistanceSch(result, filter.distance, userposition);
      }
      if (filter.rate) {
        result.sort((a, b) => Number(b.track.rate) - Number(a.track.rate));
      }
      result = distanceUtil.filterAreaSch(result, area);
      result = distanceUtil.filterDateSch(result, filter.date);
    }
    return result;
  },
};
