// import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import User from '../../entity/User';
import userUtil from '../../util/userUtil';

export default {
  post: async (req, res) => {
    const { email, password } = req.body;
    const response: any = await getConnection()
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (response) {
      res.status(409).send('User conflict');
    } else {
      const cryptedPassword: any = userUtil.cryptoPassword(password);
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          { email, password: cryptedPassword },
        ])
        .execute();
      res.status(200).send('Sign up success');
    }
  },
};
