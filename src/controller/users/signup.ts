import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import User from '../../entity/User';
import userUtil from '../../util/userUtil';

export default {
  post: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const response: any = await getConnection()
      .getRepository(User)
      .createQueryBuilder('users')
      .where('users.email = :email', { email })
      .getOne();

    // response.json();
    console.log(response);
    if (response) {
      res.status(409).send('User conflict');
    } else {
    //   const cryptoPassword: any = userUtil.cyrptoPassword(password);
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          { email, password },
        ])
        .execute();
    }
    res.status(200).send();
  },
};
