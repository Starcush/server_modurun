import scheduleController from '../controller/schedules/schedule.Controller';
import usersSchedulesController from '../controller/schedules/usersSchedules.Controller';
import index from '../middleware/index';

const router = require('express').Router();

router.get('/:filter/:userposition/:area', index.verifyToken, scheduleController.get);
router.post('/', index.verifyToken, scheduleController.post);

router.get('/user', index.verifyToken, usersSchedulesController.get);
router.delete('/user', index.verifyToken, usersSchedulesController.delete);

export default router;
