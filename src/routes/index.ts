import { Router } from 'express';
import userRouter from './users';
import messagesRouter from './messages';
import tracksRouter from './tracks';
import schedulesRouter from './schedules';

const router = Router();

router.get('/', (req: any, res: any) => {
  res.end('ok');
});
router.use('/users', userRouter);
router.use('/messages', messagesRouter);
router.use('/tracks', tracksRouter);
router.use('/schedules', schedulesRouter);

export default router;
