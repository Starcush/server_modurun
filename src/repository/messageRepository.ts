import { getConnection } from 'typeorm';
import Message from '../entity/Message';

export default {
  getScheduleMessages: async (scheduleId: number, startRow: number) => {
    const response = await getConnection()
      .query(`SELECT u.username, m.message
      FROM message m LEFT JOIN user u ON m.userId = u.id
      WHERE m.scheduleId = ${scheduleId}
      ORDER BY m.createdAt DESC
      LIMIT 10 OFFSET ${startRow};`);
    return response;
  },
  insertUserChatting: async (scheduleId, userId, message) => {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Message)
      .values([
        { scheduleId, userId, message },
      ])
      .execute();
  },
};
