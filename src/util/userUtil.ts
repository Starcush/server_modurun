import * as crypto from 'crypto';

export default {
  cyrptoPassword: (data: string): any => {
    const shasum = crypto.createHmac('sha512', 'secret');
    shasum.update(data);
    data = shasum.digest('hex');
    return data;
  },
};
