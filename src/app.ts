import express from 'express';
import { toNodeHandler } from "better-auth/node";
import test from './routes/test.routes';
import user from './routes/user.routes';
import { auth } from './utils/auth';
import shortUrl from './routes/shortUrl.routes';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();

// Logs in 'dev' format (method, URL, status, response time)
app.use(morgan('dev'));

app.use(cookieParser());
console.log("AUTH HANDLER:", typeof auth.handler);

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json()); // to make sure that the req.body is JSON {middleware}



app.use(`/test`, test)
app.use(`/user`, user)
app.use(`/shortUrl`, shortUrl)



app.get('/', (req, res) => {
    res.send('Hello World!');
});


export default app;

