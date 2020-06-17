import userUtil from '../util/userUtil';

export default {
  verifyToken: (req, res, next) => {
    const token = req.session.userToken;
    if (!token) {
      res.status(403).end('Not logged in');
    } else {
      userUtil.jwt.verify(token, (err) => {
        if (err) return false;
        next();
      });
    }
  },
};
