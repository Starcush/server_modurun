import { Router } from 'express';

const router = Router();
router.get('/', (req: any, res: any) => {
  res.end('ok');
});
router.use('/users', require('./users'));
// router.use('/messages', require('./messages'));
// router.use('/tracks', require('./tracks'));
// router.use('/shcedules', require('./shcedules'));

module.exports = router;
