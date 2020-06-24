import { getConnection } from 'typeorm';
import UserSchedule from '../entity/UserSchedule';

export default {
  getUserSchedules: async (userId) => {
    const response = await getConnection()
      .query(`SELECT s.id, s.title, t.trackTitle, s.scheduleFrom, s.scheduleTo, s.trackId
    FROM schedule s LEFT JOIN user_schedule u ON s.id = u.scheduleId RIGHT JOIN track t ON s.trackId = t.id
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
    FROM user_schedule
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
  getAllUsersSchedule: async (userId) => {
    const response = await getConnection()
      .query(`SELECT us.userId,us.scheduleId,s.title,s.scheduleFrom,s.scheduleTo,t.*
            FROM user_schedule us
            LEFT JOIN schedule s ON s.id = us.scheduleId
            LEFT JOIN track t ON t.id = s.trackId
            WHERE us.userId = ${userId}
            ORDER BY us.createdAt DESC
            `);
    return response;
  },
};
