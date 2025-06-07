import { init } from 'express-oas-generator';
import app from './app';

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`URL_Shortner app listening on port ${PORT}!`);
}); 