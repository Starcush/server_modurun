import userUtil from '../../util/userUtil';
import userRepository from '../../repository/userRepository';

export default {
  get: async (req, res) => {
    const { email } = req.query;
    const response = await userRepository.getUserDataByEmail(email);

    if (response) {
      res.status(409).send('Email conflict');
    } else {
      res.status(200).send('Available email');
    }
  },

  patch: async (req, res) => {
    const { username } = req.body;

    const userInfo = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });
    console.log(userInfo);
    const response: any = await userRepository.getUserDataByUsername(username);

    if (response) {
      res.status(409).send('Username conflict');
    } else {
      userRepository.updateUsernameByEmail(userInfo.email, username);
      res.status(200).send('Username updated');
    }
  },
};
