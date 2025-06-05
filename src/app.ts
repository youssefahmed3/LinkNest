import express from 'express';

import test from './routes/test.routes';

const app = express();

app.use(express.json()); // to make sure that the req.body is JSON {middleware}
app.use(`/test`, test)

app.get('/', (req, res) => {
    res.send('Hello World!');
});


export default app;