import { Router } from 'express';
// import passport from 'passport';

import users from './users';
import oauth from './oauth';
import messages from './messages';

// const passport = require('passport');
// require('../passport');
// import tracks from './tracks';
// import schedules from './schedules';

const router = Router();

router.get('/', (req: any, res: any) => {
  res.end('ok');
});

router.use('/users', users);
router.use('/oauth', oauth);
router.use('/messages', messages);
// router.use('/tracks', tracks);
// router.use('/schedules', schedules);

export default router;
