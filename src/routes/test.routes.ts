import express from 'express';
import { getTest, postTest } from '../controllers/test.controller';

const router = express.Router();

router.get('/get-test', getTest);

router.post('/post-test', postTest);


export default router;