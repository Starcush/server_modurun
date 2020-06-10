import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

require('dotenv').config();

export default {
  cryptoPassword: (data: string): any => {
    const shasum = crypto.createHmac('sha512', 'secret');
    shasum.update(data);
    data = shasum.digest('hex');
    return data;
  },
  jwt: {
    sign(payload) {
      return jwt.sign({
        exp: Math.floor(Date.now() / 1000 + (30 * 60)),
        data: payload,
      }, process.env.JWT_SECRET);
    },

    verify(token, callback) {
      return jwt.verify(token, process.env.JWT_SECRET, callback);
    },
    // (err, decoded) => {
    // if (err) return false;
    // return decoded.data;
  },
};
