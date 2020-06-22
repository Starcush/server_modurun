import { getConnection } from 'typeorm';
import User from '../entity/User';
import userUtil from '../util/userUtil';

export default {
  getUserDataByEmail: async (email) => {
    const response = await getConnection()
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    return response;
  },
  getUserDataByUsername: async (username) => {
    const response = await getConnection()
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
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
  insertSignUpUser: async (email, password) => {
    const cryptedPassword: any = userUtil.cryptoPassword(password);
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        { email, password: cryptedPassword },
      ])
      .execute();
  },
  updateUsernameByEmail: async (email, username) => {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ username })
      .where('email = :email', { email })
      .execute();
  },
  deleteUser: async (email) => {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('email = :email', { email })
      .execute();
  },
};
