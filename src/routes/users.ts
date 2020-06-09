import signup from '../controller/users/signup';
import user from '../controller/users/user';

const router = require('express').Router();

// router.post('/signin', users.signin.post);
router.post('/signup', signup.post);
router.patch('/user/name', user.patch);
router.get('/user/exist', user.get);
// router.get('/signout', signout.get);

// router.get('/', userController);
export default router;
