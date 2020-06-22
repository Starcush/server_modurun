import scheduleController from '../controller/schedules/schedule.Controller';
import usersSchedulesController from '../controller/schedules/usersSchedules.Controller';

const router = require('express').Router();

router.get('/:filter/:userposition/:area', scheduleController.get);
router.post('/', scheduleController.post);

router.get('/user', usersSchedulesController.get);
router.delete('/user', usersSchedulesController.delete);

export default router;
