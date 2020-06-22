import tracksController from '../controller/tracks/tracks.Controller';
import trackController from '../controller/tracks/track.Controller';

const router = require('express').Router();

router.get('/:filter/:userposition/:area', tracksController.get);
router.post('/track', trackController.post);
router.get('/track/:trackid', trackController.get);
router.delete('/track/:trackid', trackController.delete);

export default router;
