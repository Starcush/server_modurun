import userRepository from '../../repository/userRepository';


export default {
  post: async (req, res) => {
    const { email, password } = req.body;
    const response = await userRepository.getUserDataByEmail(email);

    if (response) {
      res.status(409).send('User conflict');
    } else {
      userRepository.insertSignUpUser(email, password);
      res.status(200).send('Sign up success');
    }
  },
};
