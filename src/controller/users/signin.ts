import userUtil from '../../util/userUtil';
import userRepository from '../../repository/userRepository';

require('dotenv').config();

export default {
  post: async (req, res) => {
    const { email, password } = req.body;
    const cryptedPassword = userUtil.cryptoPassword(password);
    const response = await userRepository.getUserDataByEmail(email);

    const responseJson = {
      isFirstLogin: false,
      username: '',
      text: 'Signin failed',
    };

    if (response) {
      if (response.password === cryptedPassword) {
        if (response.loginCount === 1) {
          responseJson.isFirstLogin = true;
        }
        responseJson.username = response.username;
        userRepository.increaseLoginCount(response.loginCount, email);
        const userInfo = {
          email,
          userId: response.id,
        };
        responseJson.text = 'Signin Success';
        const token = userUtil.jwt.sign(userInfo);
        // console.log(token);
        req.session.userToken = token;
        res.status(200).send(responseJson);
	}else{
	  res.status(404).send('invaild password');
	}
    } else {
      res.status(404).send(responseJson);
    }
  },
};
