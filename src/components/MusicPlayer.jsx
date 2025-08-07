import React, { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import MusicControls from "../components/MusicControls";
import MusicDetails from "./MusicDetails";
import { getYouTubeVideoId } from "../utils/getVideoIdFromUrl";
import "./css/MusicPlayer.css";

const MusicPlayer = () => {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const playerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = getYouTubeVideoId(url);
    if (id) {
      setVideoId(id);
      setUrl("");
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const opts = {
    height: "360",
    width: "640",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      controls: 0,
    },
  };

  const updateTime = () => {
    if (playerRef.current && playerRef.current.getPlayerState() === 1) {
      setCurrentTime(playerRef.current.getCurrentTime());
    }
    animationFrameRef.current = requestAnimationFrame(updateTime);
  };

  const onReady = (event) => {
    const player = event.target;
    playerRef.current = player;
    setDuration(player.getDuration());

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(updateTime);
  };

  const onEnd = () => {
    if (isRepeat && playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    } else {
      // No playlist, so do nothing or optionally pause
    }
  };

  const handleProgressClick = (e) => {
    const bar = e.target.getBoundingClientRect();
    const clickX = e.clientX - bar.left;
    const percentage = clickX / bar.width;
    const newTime = percentage * duration;

    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const toggleRepeat = () => setIsRepeat((prev) => !prev);
  const toggleShuffle = () => setIsShuffle((prev) => !prev);

  return (
    <div className="music-player-page">
      <h2>🎵 Music Player</h2>

      <form onSubmit={handleSubmit} className="link-form">
        <input
          type="text"
          placeholder="Paste YouTube link here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Play</button>
        <button
          type="button"
          onClick={() => {
            setUrl("");
            setVideoId(null);
            setCurrentTime(0);
            setDuration(0);
            if (playerRef.current) playerRef.current.stopVideo();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
          }}
        >
          Clear
        </button>
      </form>

      {videoId && (
        <div className="player-wrapper">
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onReady}
            onEnd={onEnd}
          />
          <MusicControls
            playerRef={playerRef}
            onToggleRepeat={toggleRepeat}
            onToggleShuffle={toggleShuffle}
            isRepeat={isRepeat}
            isShuffle={isShuffle}
          />
          <MusicDetails videoId={videoId} />

          <div className="progress-bar-container">
            <div className="progress-bar" onClick={handleProgressClick}>
              <div
                className="progress"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
              ></div>
            </div>
            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
