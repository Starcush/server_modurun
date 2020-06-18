import { getConnection } from 'typeorm';
import Schedule from '../entity/Schedule';
import UserSchedule from '../entity/UserSchedule';

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
};
