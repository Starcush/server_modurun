// import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import User from '../../entity/User';
import userUtil from '../../util/userUtil';

export default {
  get: async (req, res) => {
    const { email } = req.query;

    const response: any = await getConnection()
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (response) {
      res.status(409).send('Email conflict');
    } else {
      res.status(200).send('Available email');
    }
  },

  patch: async (req, res) => {
    const { username } = req.body;
    const email: string = userUtil.jwt.verify(req.cookie.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    console.log(email);
    const response: any = await getConnection()
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();

    if (response) {
      res.status(409).send('Username conflict');
    } else {
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ username })
        .where('email = :email', { email })
        .execute();
      res.status(200).send('Username updated');
    }
  },
};
