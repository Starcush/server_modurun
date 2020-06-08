import signup from '../controller/users/signup';

const router = require('express').Router();

// router.post('/signin', users.signin.post);
router.post('/signup', signup.post);
// router.patch('/user/name', users.patch);
// router.get('/exist/email/:email', users.get);

// router.get('/', userController);
export default router;
