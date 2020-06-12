import * as userController from '../controller/users/index';

const router = require('express').Router();

// router.get('/', userController);
router.post('/tracks', userController.default.track.post);
router.delete('/tracks', userController.default.track.delete);
router.patch('/tracks', userController.default.track.patch);
router.get('/tracks/:userId', userController.default.track.get);
router.post('/tracks/rate', userController.default.track.postRate);
export default router;
