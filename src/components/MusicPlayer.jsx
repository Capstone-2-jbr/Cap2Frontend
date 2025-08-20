import React, { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import MusicControls from "../components/MusicControls";
import MusicDetails from "./MusicDetails";
import Queue from "./Queue";
import { getYouTubeVideoId } from "../utils/getVideoIdFromUrl";
import "./css/MusicPlayer.css";

const YouTubeThumbnail = ({ videoId, isPlaying }) => {
  if (!videoId) return null;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return (
    <div className={`youtube-thumbnail ${isPlaying ? "spinning" : ""}`}>
      <img src={thumbnailUrl} alt="YouTube Thumbnail" />
    </div>
  );
};

const MusicPlayer = () => {
  // States
  const [url, setUrl] = useState("");
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [videoId, setVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // Refs
  const playerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // --- Handlers ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const id = getYouTubeVideoId(url);
    if (!id) return alert("Invalid YouTube URL");

    const existingIndex = queue.findIndex((track) => track.id === id);
    if (existingIndex !== -1) {
      setCurrentTrackIndex(existingIndex);
      setVideoId(id);
    } else {
      setVideoId(id);
    }
    setUrl("");
  };

  const handleAddToQueue = (e) => {
    e.preventDefault();
    const id = getYouTubeVideoId(url);
    if (!id) return alert("Invalid YouTube URL");

    const exists = queue.some((track) => track.id === id);
    if (!exists) {
      setQueue((prev) => [...prev, { id, title: `Track ${prev.length + 1}` }]);
    } else {
      alert("Track already in queue");
    }
    setUrl("");
  };

  const onReady = (event) => {
    const player = event.target;
    playerRef.current = player;
    setDuration(player.getDuration());

    const videoData = player.getVideoData();
    const id = player.getVideoUrl().split("v=")[1]?.split("&")[0];
    const title = videoData?.title || `Track ${queue.length + 1}`;

    const exists = queue.some((track) => track.id === id);
    if (!exists) {
      setQueue((prev) => [...prev, { id, title }]);
      setCurrentTrackIndex(queue.length);
    } else {
      const index = queue.findIndex((track) => track.id === id);
      setCurrentTrackIndex(index);
    }

    if (player.getPlayerState() === 1) {
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  };

  const onStateChange = (event) => {
    const state = event.data;
    if (state === 1) {
      setIsPlaying(true);
      if (!animationFrameRef.current)
        animationFrameRef.current = requestAnimationFrame(updateTime);
    } else if (state === 0 || state === 2) {
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };

  const updateTime = () => {
    if (!playerRef.current) return;
    if (playerRef.current.getPlayerState() === 1) {
      setCurrentTime(playerRef.current.getCurrentTime());
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  };

  const onEnd = () => {
    if (isRepeat && playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    } else if (isShuffle && queue.length > 0) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setCurrentTrackIndex(randomIndex);
      setVideoId(queue[randomIndex].id);
    } else {
      const nextIndex = currentTrackIndex + 1;
      if (nextIndex < queue.length) {
        setCurrentTrackIndex(nextIndex);
        setVideoId(queue[nextIndex].id);
      }
    }
  };

  const handleTrackSelect = (index) => {
    if (queue[index]) {
      setCurrentTrackIndex(index);
      setVideoId(queue[index].id);
    }
  };

  const handleRemoveTrack = (index) => {
    setQueue((prev) => {
      const newQueue = [...prev];
      newQueue.splice(index, 1);

      if (index === currentTrackIndex) {
        if (newQueue.length === 0) setVideoId(null);
        else {
          const nextIndex = Math.min(index, newQueue.length - 1);
          setCurrentTrackIndex(nextIndex);
          setVideoId(newQueue[nextIndex].id);
        }
      } else if (index < currentTrackIndex) {
        setCurrentTrackIndex((prev) => prev - 1);
      }

      return newQueue;
    });
  };

  const handleProgressClick = (e) => {
    const bar = e.target.getBoundingClientRect();
    const percentage = (e.clientX - bar.left) / bar.width;
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
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const toggleRepeat = () => setIsRepeat((prev) => !prev);
  const toggleShuffle = () => setIsShuffle((prev) => !prev);

  const opts = {
    height: "0",
    width: "0",
    playerVars: { autoplay: 1, modestbranding: 1, controls: 0 },
  };

  return (
    <div className="music-player-page">
      <h2>🎵 Music Player</h2>

      {/* Input Form */}
      <form className="link-form">
        <input
          type="text"
          placeholder="Paste YouTube link here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>
          Play
        </button>
        <button
          type="button"
          onClick={() => {
            setUrl("");
            setVideoId(null);
            setCurrentTime(0);
            setDuration(0);
            if (playerRef.current) playerRef.current.stopVideo();
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
              animationFrameRef.current = null;
            }
          }}
        >
          Clear
        </button>
          <button type="button" onClick={handleAddToQueue}>
          Add to Queue
        </button>
      </form>

      {/* --- Player layout --- */}
      {videoId && (
        <div className="player-container">
          {/* Left panel */}
          <div className="left-panel">
            <div className="thumbnail-controls">
              <YouTubeThumbnail videoId={videoId} isPlaying={isPlaying} />
              <MusicControls
                playerRef={playerRef}
                onToggleRepeat={toggleRepeat}
                onToggleShuffle={toggleShuffle}
                isRepeat={isRepeat}
                isShuffle={isShuffle}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            </div>

            <MusicDetails videoId={videoId} />
          </div>

          {/* Right panel */}
          <div className="right-panel">
            <Queue
              queue={queue}
              currentTrackIndex={currentTrackIndex}
              onPlayTrack={handleTrackSelect}
              onRemoveTrack={handleRemoveTrack}
            />
          </div>
        </div>
      )}
      {/* Progress bar */}
      {videoId && (
        <div className="progress-bar-container">
          <div className="progress-bar" onClick={handleProgressClick}>
            <div
              className="progress"
              style={{
                width: duration ? `${(currentTime / duration) * 100}%` : "0%",
              }}
            />
          </div>
          <div className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      )}

      {/* Hidden YouTube player */}
      {videoId && (
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
          onEnd={onEnd}
        />
      )}
    </div>
  );
};

export default MusicPlayer;
