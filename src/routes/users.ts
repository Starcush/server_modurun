import signup from '../controller/users/signup';
import signin from '../controller/users/signin';
import user from '../controller/users/user';
import signout from '../controller/users/signout';
import usersTracksController from '../controller/tracks/usersTracks.Controller';
import usersSchedulesController from '../controller/schedules/usersSchedules.Controller';

const router = require('express').Router();

router.post('/signin', signin.post);
router.post('/signup', signup.post);
router.patch('/user/name', user.patch);
router.get('/user/exist', user.get);
router.get('/signout', signout.get);

/*
* users/tracks
*/
router.post('/tracks', usersTracksController.post);
router.delete('/tracks', usersTracksController.delete);
router.patch('/tracks', usersTracksController.patch);
router.get('/tracks/', usersTracksController.get);
router.post('/tracks/rate', usersTracksController.postRate);


/*
* users/schedules
*/
router.get('/schedules', usersSchedulesController.get);
router.post('/schedules', usersSchedulesController.post);
router.delete('/schedules', usersSchedulesController.delete);


export default router;
