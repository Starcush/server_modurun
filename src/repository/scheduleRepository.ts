import { getConnection } from 'typeorm';
import Schedule from '../entity/Schedule';
import UserSchedule from '../entity/UserSchedule';

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
};
