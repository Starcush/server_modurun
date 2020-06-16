import { getConnection } from 'typeorm';

export default {
  getScheduleMessages: async (scheduleId: number, page: number) => {
    const response = await getConnection()
      .query(`SELECT u.username, m.message
      FROM message m LEFT JOIN user u ON m.userId = u.id
      WHERE m.scheduleId = ${scheduleId}
      ORDER BY m.createdAt DESC
      LIMIT 10 OFFSET ${page * 10};`);
    return response;
  },
};
