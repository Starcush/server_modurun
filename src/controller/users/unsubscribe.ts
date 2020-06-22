import userUtil from '../../util/userUtil';
import userRepository from '../../repository/userRepository';

export default {
  post: async (req, res) => {
    const { password } = req.body;
    const userInfo = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });

    const cryptedPasword = userUtil.cryptoPassword(password);
    const response = await userRepository.getUserDataByEmail(userInfo.email);

    try {
      if (response.password === cryptedPasword) {
        userRepository.deleteUser(response.email);
        res.status(200).send('User unsubscribed');
      } else {
        res.status(400).send('Wrong password');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
};
