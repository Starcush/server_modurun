const router = require('express').Router();
const { users } = require('../controller/users');

router.post('/signin', users.signin.post);
router.post('/singup', users.singup.post);
router.patch('/user/name', users.patch);
router.get('/exist/email/:email', users.get);

module.exports = router;
