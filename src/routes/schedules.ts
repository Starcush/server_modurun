import scheduleController from '../controller/schedules/schedule.Controller';

const router = require('express').Router();

router.get('/:filter/:userposition/:area', scheduleController.get);
router.post('/', scheduleController.post);

export default router;
