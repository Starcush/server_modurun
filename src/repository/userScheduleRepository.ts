import { getConnection } from 'typeorm';
import UserSchedule from '../entity/UserSchedule';

export default {
  getUserSchedules: async (userId) => {
    const response = await getConnection()
      .query(`SELECT s.id, s.title, t.trackTitle, s.scheduleFrom, s.scheduleTo, s.trackId
    FROM schedule s LEFT JOIN user_Schedule u ON s.id = u.scheduleId RIGHT JOIN track t ON s.trackId = t.id
    WHERE u.userId = ${userId}
    ORDER BY u.createdAt DESC;`);
    return response;
  },
  deleteUserSchedule: async (userId) => {
    const response = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserSchedule)
      .where('userId = :userid', { userid: userId })
      .execute();
    return response;
  },
  isUserSchedule: async (userId, scheduleId) => {
    const response = await getConnection()
      .query(`SELECT *
    FROM user_Schedule
    WHERE userId = ${userId} AND scheduleId = ${scheduleId}`);
    return response.length !== 0;
  },
  getParticipantsSchedule: async (scheduleId) => {
    const response = await getConnection()
      .query(`SELECT *
    FROM user_schedule
    WHERE  scheduleId = ${scheduleId}`);
    return response.length;
  },
};
