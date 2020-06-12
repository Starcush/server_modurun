import * as trackController from '../controller/tracks/index';

const router = require('express').Router();

router.get('/:filter/:userposition/:area', trackController.default.get);
router.post('/track', trackController.default.track.post);
router.get('/track/:trackid', trackController.default.track.get);
router.delete('/track/:trackid', trackController.default.track.delete);
// router.delete('/user', trackController.default.user.delete);
// router.post('/user', trackController.default.user.post);
// router.patch('/user', trackController.default.user.patch);

export default router;
