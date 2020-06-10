import signup from '../controller/users/signup';
import signin from '../controller/users/signin';
import user from '../controller/users/user';
// import passport from '../passport';

const router = require('express').Router();

router.post('/signin', signin.post);
router.post('/signup', signup.post);
router.patch('/user/name', user.patch);
router.get('/user/exist', user.get);
// router.get('/google', passport.google);
// router.get('/signout', signout.get);

// router.get('/', userController);
export default router;
