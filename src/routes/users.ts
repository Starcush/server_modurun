import * as userController from '../controller/users/index';

const router = require('express').Router();

router.get('/', userController);
export default router;
