import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const VideoThumbnail = ({ videoSrc, postId, username, type }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0); // in seconds

  const handleClick = (e) => {
    if (e.target.classList.contains("play-btn")) {
      videoRef.current.play();
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (!isPlaying) navigate(`/${username}/${type}/${postId}`);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleMetadata = () => {
    const total = videoRef.current.duration;
    setDuration(formatTime(total));
    setVideoDuration(total);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    const percent = clickX / width;
    const newTime = percent * videoDuration;

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);

    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div>
      <div
        className="relative w-full cursor-pointer group"
        onClick={handleClick}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-auto rounded-t-md border-1 border-gray-200"
          preload="metadata"
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onLoadedMetadata={handleMetadata}
          onTimeUpdate={handleTimeUpdate}
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex justify-center items-center">
            <img
              src="/images/play-button.png"
              className="w-20 h-20 pointer-events-auto play-btn"
              alt="Play"
              id="play-btn"
            />
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 border-1 border-white">
          {formatTime(currentTime)} / {duration}
        </div>
      </div>

      <div className="flex z-10 pb-2">
        <div
          className="w-full h-3 bg-gray-300 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-blue-500"
            style={{ width: `${(currentTime / videoDuration) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnail;
