import { getConnection } from 'typeorm';
import Message from '../entity/Message';

export default {
  getScheduleMessages: async (scheduleId: number, page: number) => {
    const response = await getConnection()
      .getRepository(Message)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .orderBy({ 'user.createdAt': 'DESC' })
      .getOne();
    return response;
  },
};
