import userUtil from '../util/userUtil';
import userRepository from '../repository/userRepository';

export default {
  verifyToken: (req, res, next) => {
    console.log(req)
    const token = req.session.userToken;
    if (!token) {
      res.status(403).send('Not logged in');
    }
    const userInfo = userUtil.jwt.verify(token, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    const response = userRepository.getUserDataByEmail(userInfo.email);

    try {
      if (response) {
        next();
      } else {
        res.status(403).send('Unvalid Token');
      }
    } catch (error) {
      console.log(error);
    }
  },
};
