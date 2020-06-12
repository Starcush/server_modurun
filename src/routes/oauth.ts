// import userUtil from '../util/userUtil';
// import oauthRepository from '../repository/oauthRepository';
// import userRepository from '../repository/userRepository';
import oauth from '../controller/users/oauth';

const router = require('express').Router();
// const passport = require('passport');

router.get('/google', oauth.googleLogin);

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), //클라이언트에서 받은 사용자 정보를 세션에 담음.
//   router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
//     async (req, res) => {
//       console.dir(req.session);
//       const email: string = req.user.emails[0].value;
//       const response: any = await userRepository.getUserDataByEmail(email);
//       let loginCount = null;
//       if (!response) {
//         oauthRepository.insertOauthUser(email);
//       } else {
//         loginCount = response.loginCount;
//         userRepository.increaseLoginCount(loginCount, email);
//       }

//       const token = userUtil.jwt.sign(email);
//       req.session.userToken = token;
//       const resopnseJson = {
//         isFirstLogin: false,
//       };

//       if (loginCount === null) {
//         resopnseJson.isFirstLogin = true;
//       }
//       res.send(resopnseJson);
//     }));

export default router;
