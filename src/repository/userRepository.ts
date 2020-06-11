import { getConnection } from 'typeorm';
import User from '../entity/User';

export default {
  getUserDataByEmail: async (email) => {
    const response = await getConnection()
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    return response;
  },
  increaseLoginCount: async (loginCount = 1, email) => {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ loginCount: loginCount + 1 })
      .where('email = :email', { email })
      .execute();
  },
};
