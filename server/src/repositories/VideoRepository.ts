import { ErrorableResponse, Video, VideoEntity, VideoEntityFactory } from "typedefs";
import { VideoFactory, VIDEO_FIELDS } from "typedefs/src/Video";
import VideoDAO from "../daos/VideoDAO";
import Repository from "./Repository";

//TODO: This should probably be pulled from the DB at some point
//  When / how / how often should this happen?
const MAX_ID_LENGTH = 128;

/**
 * A static class whose objective is to create safe interactions with the database
 * TODO: All of the functions within a repository boil down to the following steps:
 *      validate
 *      pass to database
 * It is probably a reasonable idea to create a Higher order function that can dynamically
 * handle these steps. This should allow for more easily creating repository methods and
 * should reduce redundant code. 
 * 
 */
const VideoRepository: Repository<Video> = class {
    /**
     * Creates a video object in the database with same infromation as the given video object.
     * NOTE: The videoId on the passed video object is ignored and the database will assign a new unique id. 
     * This new id is returned.
     * @param video The video object to create in the database
     * @returns An array whose first element is the insertId of the video object and whose second element is any error that may have occurred.
     */
    static async create(video: Video): Promise<ErrorableResponse<string>> {
        //Validate the object
        const validErr = isVideoInvalid(video);
        if (validErr) return [null, validErr];

        //Send to the database
        try {
            const videoEntity = transformToEntity(video);
            const insertId = await VideoDAO.create(videoEntity);
            return [insertId, null]
        } catch (error) {
            return [null, error]
        }
    }
    /**
     * Reads a video object from the database with a given id
     * @param id The id of the object to read
     * @returns An array whose first element is the video object retrieved from the database and second element is any error that may have occurred.
     */
    static async readOneById(id: string): Promise<ErrorableResponse<Video>> {
        //Validate the id
        const validErr = isStringInvalid(id);
        if (validErr) return [null, validErr];

        //Send to the database
        try {
            const videoEntity = await VideoDAO.readOneById(id);
            if (!videoEntity) return [null, null];

            const video = transformFromEntity(videoEntity)
            return [video, null];
        } catch (error) {
            return [null, error]
        }
    }
    /**
     * Reads all ids from the database.
     * @returns An array whose first element is the list of retrieved ids, and whose second element is any error that may have occurred.
     */
    static async readManyIds(): Promise<ErrorableResponse<Array<string>>> {
        //Send to the database
        try {
            const ids = await VideoDAO.readManyIds();
            return [ids, null];
        } catch (error) {
            return [null, error];
        }
    }
    /**
     * Reads a limited number of ids from the database. Starts reading from the given index and reads a number specified
     * @param first The index to start reading from
     * @param count The number of records to read
     * @returns An array whose first element is the list of retrieved ids, and whose second element is any error that may have occurred.
     */
    static async readLimitedIds(first: number, count: number): Promise<ErrorableResponse<Array<string>>> {
        //Validate the values
        let err = isNumberInvalid(first);
        if (err) return [null, err];
        err = isNumberInvalid(count);
        if (err) return [null, err];

        //Send to the database 
        try {
            const ids = await VideoDAO.readLimitedIds(first, count);
            return [ids, null];
        } catch (error) {
            return [null, error]
        }
    }
    /**
     * Updates a video record in the database
     * @param video Video object with the updated data to insert into the database
     * @returns An array whose first element is the response and second element is any error that may have occurred.
     */
    static async update(video: Video): Promise<ErrorableResponse<void>> {
        //Validate the values
        const validErr = isVideoInvalid(video);
        if (validErr) return [null, validErr];

        //Send to the database
        try {
            const videoEntity = transformToEntity(video);
            await VideoDAO.update(videoEntity);
            return [null, null];
        } catch (error) {
            return [null, error];
        }
    }
    /**
     * Deletes a video from the database
     * @param video The video to delete
     * @returns An array whose first element is the response and second element is any error that may have occurred.
     */
    static async delete(video: Video): Promise<ErrorableResponse<void>> {
        //Validate the values
        const validErr = isVideoInvalid(video);
        if (validErr) return [null, validErr];

        //Send to the database
        try {
            const videoEntity = transformToEntity(video);
            await VideoDAO.delete(videoEntity);
            return [null, null];
        } catch (error) {
            return [null, error];
        }
    }
}

/**
 * Validates a string to ensure it is compliant with the neccessary standards to write to the db
 * @param st The string to validate
 * @returns If the string is valid, returns null. If the string is invalid, returns an Error whose message describes the issue with the object
 */
function isStringInvalid(st: string): Error | null {
    // Typescript is not runtime validation
    if (typeof st !== 'string')
        return new Error('Value must be a string type');
    st.trim();
    // Ensure String will fit in column
    if (st.length > MAX_ID_LENGTH)
        return new Error(`Value must be shorter than ${MAX_ID_LENGTH} characters`);
    if (st.length <= 0)
        return new Error('Value cannot be empty');
    //TODO: Do we want to verify String character encoding?
    return null;
}

/**
 * TODO: Implement different validation for int / float
 * TODO: Implement validation to ensure the number is not OOB
 * Validates a number to ensure that it is compliant with the neccessary standards to write to the db
 * @param num The number to validate
 * @returns If the number is valid, returns null. If the number is invalid returns an Error whose message describe the reason
 */
function isNumberInvalid(num: number): Error | null {
    // Typescript is not runtime validation
    if (typeof num !== 'number')
        return new Error('Value must be a number type');

    return null;
}

/**
 * Validates a video object is compliant with the neccessary standards
 * @param video The Video object to validate
 * @returns If the video is valid, returns null. If the video is invalid, returns an Error whose message describes the issue with the object
 */
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

/**
 * Validates a given field on a Video Object to ensure that it conforms with the database requirements.
 * @param video The video object to validate
 * @param fieldName The field on a video object to validate
 * @returns An Error containing a message describing how the field is invalid. If the field is valid, null is returned
 */
function isPropertyInvalid(video: Video, fieldName: VIDEO_FIELDS): Error | null {
    switch (fieldName) {
        //Treat all string fields the same
        case VIDEO_FIELDS.videoId:
        case VIDEO_FIELDS.title:
        case VIDEO_FIELDS.filePath:
            return isStringInvalid(video[fieldName]);
        //NOTE: 
    }
}

/**
 * The database representation of data is often different than a representation used for application development
 * Because of this it is necessary to tranfrom between database objects (Entity) and development objects. 
 * This function transforms a development object of type Video to its database equivalent VideoEntity
 * @param video The video object to be transformed to a VideoEntity object
 * @returns a VideoEntity object containing the same data as the passed video object
 */
function transformToEntity(video: Video): VideoEntity {
    return VideoEntityFactory(video.title, video.filePath, video.videoId);
}

/**
 * The database representation of data is often different than a representation used for application development
 * Because of this it is necessary to tranfrom between database objects (Entity) and development objects. 
 * This function transforms a database object of type VideoEntity to its development equivalent Video
 * @param videoEntity The VideoEntity object to be transformed to a Video object
 * @returns a Video object containing the same data as the passed VideoEntity object
 */
function transformFromEntity(videoEntity: VideoEntity): Video {
    return VideoFactory(videoEntity.title, videoEntity.file_path, videoEntity.video_id);
}

export default VideoRepository