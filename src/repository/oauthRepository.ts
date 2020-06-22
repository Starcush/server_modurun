import { getConnection } from 'typeorm';
import User from '../entity/User';

export default {
  insertOauthUser: async (email) => {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        { email },
      ])
      .execute();
  },
};
