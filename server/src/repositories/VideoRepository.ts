import { ErrorableResponse, Video, VideoEntity, VideoEntityFactory } from "typedefs";
import { VideoFactory, VIDEO_FIELDS } from "typedefs/src/Video";
import VideoDAO from "../daos/VideoDAO";
import Repository from "./Repository";

//TODO: This should probably be pulled from the DB at some point
//  When / how / how often should this happen?
const MAX_ID_LENGTH = 128;

const VideoRepository: Repository<Video> = class {
    static async create(video: Video): Promise<ErrorableResponse<string>> {
        const validErr = isVideoInvalid(video);
        if (validErr) return [null, validErr];

        try {
            const videoEntity = transformToEntity(video);
            const insertId = await VideoDAO.create(videoEntity);
            return [insertId, null]
        } catch (error) {
            return [null, error]
        }
    }
    static async readOneById(id: string): Promise<ErrorableResponse<Video>> {
        const validErr = isStringInvalid(id);
        if (validErr) return [null, validErr];
        try {
            const videoEntity = await VideoDAO.readOneById(id);
            if (!videoEntity) return [null, null];

            const video = transformFromEntity(videoEntity)
            return [video, null];
        } catch (error) {
            return [null, error]
        }
    }
    static async readManyIds(): Promise<ErrorableResponse<Array<string>>> {
        try {
            const ids = await VideoDAO.readManyIds();
            return [ids, null];
        } catch (error) {
            return [null, error];
        }
    }
    static async readLimitedIds(first: number, count: number): Promise<ErrorableResponse<Array<string>>> {
        try {
            const ids = await VideoDAO.readLimitedIds(first, count);
            return [ids, null];
        } catch (error) {
            return [null, error]
        }
    }
    static async update(video: Video): Promise<ErrorableResponse<void>> {
        const validErr = isVideoInvalid(video);
        if (validErr) return [null, validErr];

        try {
            const videoEntity = transformToEntity(video);
            await VideoDAO.update(videoEntity);
            return [null, null];
        } catch (error) {
            return [null, error];
        }
    }
    static async delete(video: Video): Promise<ErrorableResponse<void>> {
        const validErr = isVideoInvalid(video);
        if (validErr) return [null, validErr];

        try {
            const videoEntity = transformToEntity(video);
            await VideoDAO.delete(videoEntity);
            return [null, null];
        } catch (error) {
            return [null, error];
        }
    }
}

function isStringInvalid(id: string): Error | null {
    // Typescript is not runtime validation
    if (typeof id !== 'string')
        return new Error('Value must be a string type');
    id.trim();
    // Ensure ID will fit in column
    if (id.length > MAX_ID_LENGTH)
        return new Error(`Value must be shorter than ${MAX_ID_LENGTH} characters`);
    if (id.length <= 0)
        return new Error('Value cannot be empty');
    //TODO: Do we want to verify ID character encoding?
    return null;
}

function isVideoInvalid(video: Video): Error | null {
    // Typescript is not runtime validation
    if (typeof video !== 'object')
        return new Error('Video must be an object type');
    const properties = Object.keys(video);
    // Don't allow extra properties - likely not a problem
    //  but there is a small risk of something wonky going on
    //  with prototype injection
    const fields = Object.values(VIDEO_FIELDS);
    if (properties.length > fields.length)
        return new Error(`Object ${video} has unknown fields`);
    // Validate the properties on the object
    for (let i = 0; i < fields.length; i++) {
        const fieldName = fields[i];
        if (!video.hasOwnProperty(VIDEO_FIELDS[fieldName]))
            return new Error(`Object ${video} must have field: ${fieldName}`);
        const error = isPropertyInvalid(video, fieldName);
        if (error) return error;
    }
    return null;
}

function isPropertyInvalid(video: Video, fieldName: VIDEO_FIELDS): Error | null {
    switch (fieldName) {
        case VIDEO_FIELDS.videoId:
            return isStringInvalid(video.videoId);
        case VIDEO_FIELDS.title:
            return isStringInvalid(video.title);
        case VIDEO_FIELDS.filePath:
            return isStringInvalid(video.filePath);
    }
}

function transformToEntity(video: Video): VideoEntity {
    return VideoEntityFactory(video.title, video.filePath, video.videoId);
}
function transformFromEntity(videoEntity: VideoEntity): Video {
    return VideoFactory(videoEntity.title, videoEntity.file_path, videoEntity.video_id);
}

export default VideoRepository