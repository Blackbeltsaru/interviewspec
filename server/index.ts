import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import VideoDAO from './dao/VideoDAO';
import * as db from './db';
import { Video } from './types/Video';
import cors from 'cors';

const app = express();

//NOTE: cors is generally not a good idea, in this case its to simplify the application 
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());

app.post('/videos', async (request, response) => {
    const { title, filePath } = request.body;
    if (!title?.trim() || !filePath?.trim()) {
        return response.status(400).send("title and filePath are required");
    }
    const video: Video = {
        videoId: '',
        title: title,
        filePath: filePath
    };

    try {
        const insertId = await VideoDAO.create(video);
        response.status(200).json({
            message: 'Video Created',
            insertId,
        });
    } catch (err) {
        response.status(500).send(err.message);
    }
});

app.get('/videos', async (request, response) => {
    try {
        const ids = await VideoDAO.readManyIds();
        response.status(200).json(ids);
    } catch (error) {
        response.status(500).send(error.message);
    }
});

app.get('/videos/:videoId', async (request, response) => {
    try {
        const video = await VideoDAO.readOneById(request.params.videoId);
        if (!video) return response.status(404).send('Not Found');
        response.status(200).json(video);
    } catch (error) {
        response.status(500).send(error.message);
    }
})

db.connect()
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Express server started on port ${process.env.SERVER_PORT}`);
})