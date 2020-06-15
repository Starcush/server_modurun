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
<<<<<<< HEAD
router.use('/tracks', tracks);
// router.use('/schedules', schedulesRouter);
=======
router.use('/messages', messages);
// router.use('/tracks', tracks);
// router.use('/schedules', schedules);
>>>>>>> f80ace41a929cd435630ac3208a563e557e42add

export default router;
