import userUtil from '../util/userUtil';
import '../env';

const exceptUrls = [
  '/users/signin',
  '/users/signup',
  '/users/user/exist',
  '/users/signout',
];

export default {
  verifyToken: (req, res, next) => {
    // exceptUrls에 포함되는 요청
    if (req) {
      if (exceptUrls.includes(req.url)) {
        next();
        return;
      }
      // 개발 환경일 경우 예외 처리
      if (process.env.USER_ID) {
        next();
        return;
      }

      const token = req.session.userToken;
      if (!token) {
        res.status(403).end('Not logged in');
      } else {
        userUtil.jwt.verify(token, (err) => {
          if (err) return false;
          next();
        });
      }
    }
    next();
  },
};
