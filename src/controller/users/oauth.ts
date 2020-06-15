import userRepository from '../../repository/userRepository';
import oauthRepository from '../../repository/oauthRepository';
import userUtil from '../../util/userUtil';


export default {
  googleLogin: async (req, res) => {
    // const email: string = req.user.emails[0].value;
    const { email } = req.body;
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
      isFirstLogin: false,
    };

    if (loginCount === null) {
      resopnseJson.isFirstLogin = true;
    }
    res.send(resopnseJson);
  },
};
