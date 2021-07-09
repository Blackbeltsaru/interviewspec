import { UNKNOWN_ID } from './Constants';

// Type defining a video
export type Video = {
    videoId: string,
    title: string,
    filePath: string,
  };

export function VideoFactory(title: string, filePath: string, vidId?: string): Video {
  return {
    videoId: vidId ?? UNKNOWN_ID,
    title,
    filePath
  };
}

//TODO: This should eventually be pulled directly from the 
//  video type. 
// Used for field validation on a video object
export enum VIDEO_FIELDS {
  videoId = "videoId",
  title = "title",
  filePath = "filePath",
};
  