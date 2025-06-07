import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from './utils/auth';
import shortUrl from './routes/shortUrl.routes';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();

// Logs in 'dev' format (method, URL, status, response time)
app.use(morgan('dev'));

app.use(cookieParser());

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json()); // to make sure that the req.body is JSON {middleware}



app.use(`/shortUrl`, shortUrl)



app.get('/', (req, res) => {
    res.send('API is working correctly');
});


export default app;

