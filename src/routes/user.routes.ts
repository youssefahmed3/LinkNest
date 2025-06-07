import express from 'express';
import { getUser, createUser } from '../controllers/user.controller';

const router = express.Router();

router.post('/createUser', createUser)

router.get('/getUser', getUser);


export default router;