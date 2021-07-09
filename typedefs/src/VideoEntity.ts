import { UNKNOWN_ID } from './Constants';
import { EditStatus } from './EditStatus';
export type VideoEntity = {
    video_id: string,
    title: string,
    file_path: string,
    edit_status?: EditStatus,
}

export function VideoEntityFactory(title: string, file_path: string, videoId?: string, editStatus?: EditStatus): VideoEntity {
    return {
        video_id: videoId ?? UNKNOWN_ID,
        title,
        file_path,
        edit_status: editStatus ?? EditStatus.Editable
    };
}