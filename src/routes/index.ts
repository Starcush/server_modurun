import { Router } from 'express';
import users from './users';
// import messages from './messages';
// import tracks from './tracks';
// import schedules from './schedules';

const router = Router();

router.get('/', (req: any, res: any) => {
  res.end('ok');
});

router.use('/users', users);
// router.use('/messages', messages);
// router.use('/tracks', tracks);
// router.use('/schedules', schedules);

export default router;
