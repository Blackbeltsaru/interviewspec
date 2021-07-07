import express from 'express';
import { Video } from 'typedefs';
import VideoRepository from '../repositories/VideoRepository';
import { safeRoute } from '../util/HOF';

const router = express.Router();

/**
 * Post a video to the server
 * Request Body: 
 * {
 *    title: 'myTitle',
 *    filePath: 'path/to/video.mp4'
 * }
 */
router.post('/videos', safeRoute(async (request, response) => {
    const { title, filePath } = request.body;
    if (!title?.trim()) return response.status(400).send("Field: 'title' is required");
    if (!filePath?.trim()) return response.status(400).send("Field: 'filePath' is required");

    const video: Video = {
        videoId: '',
        title,
        filePath
    };

    const [insertId, error] = await VideoRepository.create(video);
    if (error) return response.status(500).send(error.message);
    return response.status(200).json({
        message: 'Video Created',
        insertId,
    });
}));

/**
 * Get a list of all available video ids
 * Response: 
 * ['id1', 'id2']
 */
router.get('/videos', safeRoute(async (request, response) => {
    
    const [ids, error] = await VideoRepository.readManyIds();
    if (error) return response.status(500).send(error.message);
    return response.status(200).json(ids);
}));

/**
 * Get the details of a video viden the video id
 * Response: 
 * {
 *     videoId: 'id1',
 *     title: 'myTitle',
 *     filePath: 'path/to/video.mp4'
 * }
 */
router.get('/videos/:videoId', safeRoute(async (request, response) => {
    const id = request.params.videoId;
    const [video, error] = await VideoRepository.readOneById(id);
    if (error) return response.status(500).send(error.message);
    if (!video) return response.status(404).send('Not Found');
    response.status(200).json(video);
}));

export default router;