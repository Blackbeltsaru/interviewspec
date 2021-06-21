import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Video } from '../../types/Video';
import { readOneVidById } from '../../util/network';
import ErrorDisplay from '../errordisplay/ErrorDisplay';
import Loader from '../loader/Loader';
import './Watcher.css';

// Static value defining the default resolution selection
const defaultResIndex: number = 1;
// Static list defining the resolution options
const resOptions = [
  "240",
  "480",
  "1080",
  "4096"
];

// Type defining the URL params for the watcher
type WatchParams = {
  vidId: string,
};

/// Component used for watching a video - allows for selection of the playback resolution
function Watcher() {
  /// Setup the state for the watcher
  // The selected resolution to play the video
  const [selectedResIdx, setSelectedResIdx] = useState<number>(defaultResIndex);
  // Is the watcher currently loading the video
  const [loading, setLoading] = useState(true);
  // The video to play back - undefined if there is no video to play
  const [video, setVideo] = useState<Video | undefined>();
  // Any error that may have occured while trying to load the video - undefined if there is no error
  const [errorCode, setErrorCode] = useState<number | undefined>();
  //Reference to video tag to cause load event
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // URL parameters from the router
  const params = useParams<WatchParams>();

  /// Watcher Functions

  /**
   * Handles a resolution selection, resulting in the video resolution being changed
   * NOTE: This does not persist video state - as video state persistance is not part of the spec
   * this will not be implemented
   * @param event the change event caused by the selection
   */
  const handleResChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(event.target.value);
    if (isNaN(index)) console.error(`something went wrong - ${event.target.value} is not a valid selection`);
    setSelectedResIdx(index);
  }

  /**
   * Preprare for a fetch - tell the watcher that something is loading
   * Other side effects may go here, so breaking this out to its own function
   * can generally be helpful
   */
  const prepareForFetch = () => {
    setLoading(true);
  };

  /**
   * Finalize after a fetch - tell the watcher we are ready for playback
   * For more complex applications that may do multiple different fetches, 
   * this pattern should be extended to allow for different behavior depending
   * on the resolved fetch
   * @param video - The video to be played
   */
  const finalizeFetch = (video: Video) => {
    setErrorCode(undefined);
    setLoading(false);
    setVideo(video);
  };

  /**
   * Cleanup the state if there was an error during the fetch
   * Tell the watcher we have finished the fetch and build the error code
   * If the error does not have an error code, something went wrong client side
   * so set the error code to 400
   * @param error 
   */
  const errorFetch = (error: Error) => {
    let errorCode = parseInt(error.message);
    if (isNaN(errorCode)) errorCode = 400;
    setErrorCode(errorCode);
    setLoading(false);
    setVideo(undefined);
  }

  // Tell the watcher to re-fetch the video whenever the url params change
  useEffect(() => {
    prepareForFetch();
    //TODO: Only resolve the latest request
    const requestedId = params.vidId
    readOneVidById(requestedId)
      .then((video: Video) => {
        if (requestedId === params.vidId)
          finalizeFetch(video);
      })
      .catch((error: Error) => {
        if (requestedId === params.vidId)
          errorFetch(error);
      })
  }, [params]);

  // When the resolution changes, for the video to reload
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [selectedResIdx])
  
  /// Render
  // If we are currently loading, display the loader
  // NOTE: You could definately be smarter with what you display while loading
  // for example you could still create the video area, resolution selector etc,
  // and place a spinner in place of the video. For the sake of this spec, I am 
  // displaying a simple loader
  if (loading) return <Loader/>;

  if (errorCode) return <ErrorDisplay errorCode={errorCode}/>
  // Due to the way the component is designed, the only time the loader is not shown
  // is when we have already attempted to read the video. Thus, if the video has not been
  // set by this point, we could not find the video in the DB (or something else went wrong)
  if (!video) return <ErrorDisplay errorCode={404}/>

  return (
    <div className="Watcher">
      <div className="Header">
        <h1>{video.title}</h1>
      </div>
      <div className="PlayArea">
        <video controls ref={videoRef}>
          <source src={`${process.env.PUBLIC_URL}/${resOptions[selectedResIdx]}/${video.filePath}`} />
        </video>
      </div>
      <div className="ResSelect">
        <select
          value={selectedResIdx}
          onChange={handleResChange}
        >
          {/* This map probably is unneccessary as the resolution selection is unlikely to change,
              however, there is minimal performance hit to this and its more expandable
           */}
          {resOptions.map((resOption: string, index: number) => {
            return (
              <option 
                key={index}
                value={index}

              >
                {resOption}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default Watcher;
