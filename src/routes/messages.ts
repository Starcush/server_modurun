import messages from '../controller/messages/messages';


const router = require('express').Router();

router.get('/messages', messages.get);


export default router;
