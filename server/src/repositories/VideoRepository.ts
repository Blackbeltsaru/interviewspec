import { ErrorableResponse, Video, VideoEntity } from "typedefs";
import VideoDAO from "../daos/VideoDAO";
import Repository from "./Repository";

const VideoRepository: Repository<Video> = class {
    static async create(video: Video): Promise<ErrorableResponse<string>> {
        const validErr = isInvalid(video);
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
        const validErr = isInvalid(id);
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
        const validErr = isInvalid(video);
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
        const validErr = isInvalid(video);
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

function isInvalid(id: string): Error | null;
function isInvalid(video: Video): Error | null;
function isInvalid(data: any): Error | null {
    throw new Error("Method not implemented.");
}
function transformToEntity(video: Video): VideoEntity {
    throw new Error("Method not implemented.");
}
function transformFromEntity(videoEntity: VideoEntity): Video {
    throw new Error("Method not implemented.");
}

export default VideoRepository