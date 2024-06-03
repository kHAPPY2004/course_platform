import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { useRecoilValueLoadable } from "recoil";
import { filteredVideostate } from "../store/atoms/getVideos";
import { useParams } from "react-router-dom";

import CourseSlugRedirector from "../components/course_protect";

const CourseSlugViewer: React.FC = () => {
  const allvid: any = useRecoilValueLoadable(filteredVideostate);
  console.log("all vid", allvid);

  const playerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [speed, setSpeed] = useState<number>(1);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [played, setPlayed] = useState<number>(0);
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [showSpeed, setShowSpeed] = useState<boolean>(false);
  const [selectedQuality, setSelectedQuality] = useState<string>("auto");
  const [showQuality, setShowQuality] = useState<boolean>(false);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleKeyPress = (e: KeyboardEvent) => {
    const isShiftPressed = e.shiftKey;
    const key = e.key;
    switch (key) {
      case " ":
        togglePlay();
        break;
      case "k":
        togglePlay();
        break;
      case "ArrowUp":
        increaseVolume();
        break;
      case "ArrowDown":
        decreaseVolume();
        break;
      case "ArrowLeft":
        seekBackward();
        break;
      case "ArrowRight":
        seekForward();
        break;
      case "j":
        seekBackward_10();
        break;
      case "l":
        seekForward_10();
        break;
      case "f":
        toggleFullScreen();
        break;
      // case "i":
      //   toggleMiniPlayer();
      //   break;
      case "Escape":
        toggleCinemaMode();
        break;
      case "t": // Toggle cinema mode when "t" key is pressed
        toggleCinemaMode();
        break;
      case "<":
        if (isShiftPressed) {
          decreaseSpeed();
        }
        break;
      case ">": // Increase playback rate on SHIFT+.
        if (isShiftPressed) {
          increaseSpeed();
        }
        break;
      default:
        break;
    }
  };
  const handleQualityMouseEnter = () => {
    setShowQuality(true);
  };

  const handleQualityMouseLeave = () => {
    setShowQuality(false);
  };
  const togglePlay = () => {
    setIsPlaying((prevState) => !prevState);
  };

  const increaseVolume = () => {
    setVolume((prevVolume) => Math.min(prevVolume + 0.1, 1));
    setShowVolume(true); // Show volume percentage when adjusting volume
    setTimeout(() => setShowVolume(false), 2000); // Hide volume percentage after 2 seconds
    return volume;
  };

  const decreaseVolume = () => {
    setVolume((prevVolume) => Math.max(prevVolume - 0.1, 0));
    setShowVolume(true); // Show volume percentage when adjusting volume
    setTimeout(() => setShowVolume(false), 2000); // Hide volume percentage after 2 seconds
    return volume;
  };
  const increaseSpeed = () => {
    setSpeed((prevSpeed) => Math.min(prevSpeed + 0.25, 2)); // Increase playback rate by 0.25x, max 2x
    setShowSpeed(true); // Show volume percentage when adjusting volume
    setTimeout(() => setShowSpeed(false), 2000); // Hide volume percentage after 2 seconds
    return speed;
  };

  const decreaseSpeed = () => {
    setSpeed((prevSpeed) => Math.max(prevSpeed - 0.25, 0.25)); // Decrease playback rate by 0.25x, min 0.25x
    setShowSpeed(true); // Show volume percentage when adjusting volume
    setTimeout(() => setShowSpeed(false), 2000); // Hide volume percentage after 2 seconds
    return speed;
  };
  const seekForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const newTime = currentTime + 5;
      const duration = playerRef.current.getDuration();
      playerRef.current.seekTo(Math.min(newTime, duration), "seconds");
    }
  };
  const seekForward_10 = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const newTime = currentTime + 10;
      const duration = playerRef.current.getDuration();
      playerRef.current.seekTo(Math.min(newTime, duration), "seconds");
    }
  };
  const seekBackward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime - 5, "seconds");
    }
  };
  const seekBackward_10 = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime - 10, "seconds");
    }
  };
  const toggleFullScreen = () => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player) {
        if (!document.fullscreenElement) {
          player.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    }
  };

  const toggleCinemaMode = () => {
    setIsCinemaMode((prevState) => !prevState); // Toggle cinema mode
  };
  const handleDuration = (duration: number) => setDuration(duration);
  const handleProgress = (progress: { played: number }) =>
    setPlayed(progress.played);
  const handleBuffer = () => setIsBuffering(true);
  const handleBufferEnd = () => setIsBuffering(false);
  const handleError = () => setIsError(true);
  const handlePlaybackQualityChange = (quality: string) => {
    // Handle playback quality change here
    console.log("Playback quality changed to:", quality);
  };
  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuality(e.target.value);
    // playerRef.current?.selectPlaybackQuality(e.target.value);
  };
  const getVideoUrl = () => {
    if (allvid.state !== "hasValue" || !allvid.contents.length) return "";

    const video = allvid.contents[0]; // Assuming only one video object is present
    switch (selectedQuality) {
      case "360p":
        return video.video_360p_mp4_1;
      case "720p":
        return video.video_720p_mp4_1;
      case "1080p":
        return video.video_1080p_mp4_1;
      default:
        return (
          video.video_360p_mp4_1 ||
          video.video_720p_mp4_1 ||
          video.video_1080p_mp4_1
        );
    }
  };

  const videoUrl = getVideoUrl();
  return (
    <>
      {allvid.state === "hasValue" && allvid.contents.length < 1 && (
        <div className="m-10 text-red-200">No Video Available</div>
      )}
      {allvid.state === "hasValue" && allvid.contents.length > 0 && (
        <div
          onMouseEnter={handleQualityMouseEnter} // Add onMouseEnter event
          onMouseLeave={handleQualityMouseLeave} // Add onMouseLeave event
          className={`relative ${
            isCinemaMode ? "w-full h-2/3" : "w-2/3 h-2/3"
          }`}
        >
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            playing={isPlaying}
            volume={volume}
            playbackRate={speed}
            width="100%"
            height="100%"
            controls
            className="border-none"
            config={{
              file: { attributes: { controlsList: "nodownload" } },
            }}
            onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
            onPlaybackQualityChange={handlePlaybackQualityChange}
            onBuffer={handleBuffer}
            onBufferEnd={handleBufferEnd}
            onError={handleError}
            onDuration={handleDuration}
            onProgress={handleProgress}
          />
          {isBuffering && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-75">
              <div className="text-white">Buffering...</div>
            </div>
          )}
          {isError && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-75">
              <div className="text-white">Error loading video</div>
            </div>
          )}
          {showQuality && (
            <div className="absolute top-2 right-2 flex items-center">
              <>
                <span className="text-white mr-2">Quality:</span>
                <select
                  className="bg-gray-800 text-white rounded p-1"
                  value={selectedQuality}
                  onChange={handleQualityChange}
                >
                  <option value="auto">Auto</option>
                  <option value="360p">360p</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                </select>
              </>
            </div>
          )}
          {showVolume && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:bg-gray-800 bg-gray-100 rounded-md p-2"
              style={{ zIndex: 9999 }}
            >
              <span className="dark:text-white text-black">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
          {showSpeed && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:bg-gray-800 bg-gray-100 rounded-md p-2"
              style={{ zIndex: 9999 }}
            >
              <span className="dark:text-white text-black">{speed}x</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const VideoPlayer: React.FC = () => {
  const [see, setSee] = useState(false);
  const params: any = useParams();
  return (
    <>
      <CourseSlugRedirector setSee={setSee} params={params} />
      {see && <CourseSlugViewer />}
    </>
  );
};

export default VideoPlayer;
