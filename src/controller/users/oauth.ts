import { OAuth2Client } from 'google-auth-library';
import userRepository from '../../repository/userRepository';
import oauthRepository from '../../repository/oauthRepository';
import userUtil from '../../util/userUtil';

require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export default {
  googleLogin: (req, res) => {
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: req.body.it,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    }
    verify()
      .then(async (payload) => {
        const { email } = payload;
        const response: any = await userRepository.getUserDataByEmail(email);
        let loginCount = null;
        if (!response) {
          oauthRepository.insertOauthUser(email);
        } else {
          loginCount = response.loginCount;
          userRepository.increaseLoginCount(loginCount, email);
        }

        const token = userUtil.jwt.sign(email);
        req.session.userToken = token;
        const resopnseJson = {
          username: '',
          isFirstLogin: false,
        };

        if (loginCount === null) {
          resopnseJson.isFirstLogin = true;
        } else {
          resopnseJson.username = response.username;
        }
        res.status(200).send(resopnseJson);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  },
};
