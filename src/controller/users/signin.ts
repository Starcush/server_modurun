// import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';
import User from '../../entity/User';
import userUtil from '../../util/userUtil';

require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_API_KEY);

export default {
  post: async (req, res) => {
    async function verify() {
      console.log(req.body.clientToken); // 클라이언트 토큰
      const ticket = await client.verifyIdToken({
        idToken: req.body.clientToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    }

    verify()
      .then(async (payload) => { //if payload??
        console.dir(payload);
        const { email, password } = req.body;
        const cryptedPassword = userUtil.cryptoPassword(password);
        const oauthEmail = payload.email;
        const oauthPassword = payload.sub;
        const response: any = await getConnection()
          .getRepository(User)
          .createQueryBuilder('user')
          .where('user.email = :email', { email })
          .getOne();

        if (!payload) {
          const responseJson = {
            isFirstLogin: false,
            text: 'Signin failed',
          };
          if (response.password === cryptedPassword) {
            if (response.loginCount === 1) {
              responseJson.isFirstLogin = true;
            }
            responseJson.text = 'Signin Success';
            const token = userUtil.jwt.sign(email);
            res.cookie('userToken', token, {
              sameSite: 'none',
            });
            res.status(200).send(responseJson);
          } else {
            res.status(404).send(responseJson);
          }
        } else {
          await getConnection()
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
              { email: oauthEmail, password: oauthPassword },
            ])
            .execute();
          res.status(200).send('Signin Success');
        }
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  },
};
