import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import * as db from './src/db';
import cors from 'cors';
import VideoController from './src/controllers/VideoController';

const app = express();

//NOTE: cors is generally not a good idea, in this case its to simplify the application 
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use('/api', VideoController);

db.connect();
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Express server started on port ${process.env.SERVER_PORT}`);
})