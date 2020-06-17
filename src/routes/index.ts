import { Router } from 'express';

import users from './users';
import oauth from './oauth';
import messages from './messages';

const router = Router();

// router.get('/', (req, res) => {
//   res.sendFile(`${__dirname}/socketTest.html`);
// });


router.get('/', (req: any, res: any) => {
  res.end('ok');
});

router.use('/users', users);
router.use('/oauth', oauth);
router.use('/messages', messages);

export default router;
