// import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
// import { OAuth2Client } from 'google-auth-library';
import User from '../../entity/User';
import userUtil from '../../util/userUtil';

require('dotenv').config();

export default {
  post: async (req, res) => {
    const { email, password } = req.body;
    const cryptedPassword = userUtil.cryptoPassword(password);
    const response: any = await getConnection() //쿼리빌터 따로 분리해서 모아놓기
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    const responseJson = {
      isFirstLogin: false,
      text: 'Signin failed',
    };

    if (response.password === cryptedPassword) {
      if (response.loginCount === 1) {
        responseJson.isFirstLogin = true;
      }
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ loginCount: response.loginCount + 1 })
        .where('email = :email', { email })
        .execute();
      responseJson.text = 'Signin Success';
      const token = userUtil.jwt.sign(email);
      res.cookie('userToken', token, {
        sameSite: 'none',
      });
      res.status(200).send(responseJson);
    } else {
      res.status(404).send(responseJson);
    }
  },
};
