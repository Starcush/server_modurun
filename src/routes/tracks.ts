import * as trackController from '../controller/tracks/index';

const router = require('express').Router();

router.get('/', trackController);

export default router;
