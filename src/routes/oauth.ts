import oauth from '../controller/users/oauth';

const router = require('express').Router();

router.post('/google', oauth.googleLogin);

export default router;
