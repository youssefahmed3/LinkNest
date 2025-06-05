import * as testService from '../services/test.service';
import { db } from '../drizzle';
export function getTest(req, res) {
    const test = testService.getTest();
    res.send(test);
}

export function postTest(req, res) {
    console.log(req.body);
    res.status(200).json({ message: 'POST received successfully', data: req.body });
}