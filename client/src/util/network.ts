import { Video } from "typedefs";
import axios from 'axios';

/**
 * Read a video object from the server and return the result
 * @param vidId - the ID of the video to read
 * @returns a Video object on success - on fail return undefined
 * NOTE: it may be beneficial to return an error code rather than undefined
 * the only way I know how to do that cleanly though breaks typical typescript
 * best practices so I'll avoid that for now
 */
export async function readOneVidById(vidId: string): Promise<Video> {
    try {
        //TODO: Hard coding the protocol here is not really good practice - since I expect this to always be local host - will not adjust
        const response = await axios.get<Video>(`http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/videos/${vidId}`);
        if (response.status !== 200) throw new Error(response.status.toString());
        return response.data;
    } catch (error: any) {
        let errorCode = 500;
        if (error.response) errorCode = error.response.status;
        throw new Error(errorCode.toString());
    }
}

export async function readManyVidIds(): Promise<Array<string>> {
    try {
        //TODO: Hard coding the protocol here is not really good practice - since I expect this to always be local host - will not adjust
        const response = await axios.get<Array<string>>(`http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/videos`);
        if (response.status !== 200) throw new Error(response.status.toString());
        return response.data;
    } catch (error: any) {
        let errorCode = 500;
        if (error.response) errorCode = error.response.status;
        throw new Error(errorCode.toString());
    }
}