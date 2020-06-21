import { nodemailer } from 'nodemailer';
import userRepository from '../../repository/userRepository';
import userUtil from '../../util/userUtil';

export default {
  get: (req, res) => {
    const { email } = req.query;
    const response = userRepository.getUserDataByEmail(email);
    try {
      if (response) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let tempPassword = '';

        for (let i = 0; i < 8; i += 1) tempPassword += possible.charAt(Math.floor(Math.random() * possible.length));

        const transporter = nodemailer.createTransport({    //error
          service: 'gmail',
          auth: {
            user: 'modurunManager@gmail.com',
            pass: 'test1234!',
          },
        });

        const mailOptions = {
          from: 'modurunManager@gmail.com',
          to: email,
          subject: '모두런 임시 비밀번호 입니다',
          text: `모두런 임시 비밀번호 입니다 ${tempPassword}`,
        };
        tempPassword = userUtil.cryptoPassword(tempPassword);
        userRepository.updateUserPassword(email, tempPassword);
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        });
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.dir(err);
      res.status(500).send(err);
    }
  },
  post: (req, res) => {
    const { password } = req.body;
    const email = userUtil.jwt.verify(req.session.userToken, (err, decoded) => {
      if (err) return false;
      return decoded.data.email;
    });

    try {
      const response = userRepository.updateUserPassword(email, password);
      if (response) {
        res.status(200).send('Password changed');
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
};
