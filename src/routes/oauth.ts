import { getConnection } from 'typeorm';
import userUtil from '../util/userUtil';
import User from '../entity/User';
import oauthRepository from '../repository/oauthRepository';
import userRepository from '../repository/userRepository';

const router = require('express').Router();
const passport = require('passport');

// const isLoggedIn = (req, res, next) => {
//     console.log(req.user)
//   if (req.user) {
//     next();
//   } else {
//     res.sendStatus(401);
//   }
// };

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  async (req, res) => {
    const email: string = req.user.emails[0].value;
    const response: any = await userRepository.getUserDataByEmail(email);
    let loginCount = 0;
    if (!response) {
      oauthRepository.insertOauthUser(email);
    } else {
      loginCount = response.loginCount;
      userRepository.increaseLoginCount(loginCount, email);
    }

    const token = userUtil.jwt.sign(email);
    res.cookie('userToken', token, {
      sameSite: 'none',
    });
    const resopnseJson = {
      isFirstLogin: false,
    };
    //insert가 비동기여서 처음 로그인한 oauth유저가 없어서 undefined가 나왔었음
    if (loginCount === 0) {
      resopnseJson.isFirstLogin = true;
    }
    res.send(resopnseJson);
    // res.redirect('/');
  });

export default router;
