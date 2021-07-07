import { EditStatus } from './EditStatus';
export type VideoEntity = {
    video_id: string,
    title: string,
    file_path: string,
    edit_status?: EditStatus,
}