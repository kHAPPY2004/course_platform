import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
const videoControls = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [speed, setSpeed] = useState<number>(1);
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [showSpeed, setShowSpeed] = useState<boolean>(false);
  const [showQuality, setShowQuality] = useState<boolean>(false);
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
};

export default videoControls;
