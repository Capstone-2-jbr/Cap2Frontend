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
  const [url, setUrl] = useState("");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [queue, setQueue] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  const playerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = getYouTubeVideoId(url);
    if (id) {
      playVideo(id);
      setUrl("");
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const onStateChange = (event) => {
    const playerState = event.data;
    if (playerState === 1) {
      setIsPlaying(true);
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    } else if (playerState === 2 || playerState === 0) {
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };

  const playVideo = (id) => {
    setVideoId(id);
  
    if (!queue.find((track) => track.id === id)) {
      const title = `Track ${queue.length + 1}`; // Optional for the YT API.
      const newTrack = { id, title };
      setQueue((prev) => [...prev, newTrack]);
      setCurrentTrackIndex(queue.length);
    } else {
      const index = queue.findIndex((track) => track.id === id);
      setCurrentTrackIndex(index);
    }
  };

  const handleQueueItemClick = (id) => {
    const index = queue.indexOf(id);
    if (index !== -1) {
      setVideoId(id);
      setCurrentTrackIndex(index);
    }
  };

  const handleTrackSelect = (index) => {
    const selectedId = queue[index];
    if (selectedId) {
      setVideoId(selectedId);
      setCurrentTrackIndex(index);
    }
  };

  const handleRemoveTrack = (index) => {
    setQueue((prevQueue) => {
      const newQueue = [...prevQueue];
      newQueue.splice(index, 1);

      if (index === currentTrackIndex) {
        if (newQueue.length === 0) {
          setVideoId(null);
        } else {
          const nextIndex = Math.min(index, newQueue.length - 1);
          setVideoId(newQueue[nextIndex]);
          setCurrentTrackIndex(nextIndex);
        }
      } else if (index < currentTrackIndex) {
        setCurrentTrackIndex((prev) => prev - 1);
      }

      return newQueue;
    });
  };

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      controls: 0,
    },
  };

  const updateTime = () => {
    if (!playerRef.current) return;
    if (playerRef.current.getPlayerState() === 1) {
      setCurrentTime(playerRef.current.getCurrentTime());
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };

  const onReady = (event) => {
    const player = event.target;
    playerRef.current = player;
    setDuration(player.getDuration());

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (player.getPlayerState() === 1) {
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  };

  const onEnd = () => {
    if (isRepeat && playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    } else if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      const nextVideoId = queue[randomIndex];
      setVideoId(nextVideoId);
      setCurrentTrackIndex(randomIndex);
    } else {
      const nextIndex = currentTrackIndex + 1;
      if (nextIndex < queue.length) {
        setVideoId(queue[nextIndex]);
        setCurrentTrackIndex(nextIndex);
      }
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
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div
      className={`music-player-page ${darkMode ? "dark-mode" : "light-mode"}`}
    >
      <h2>🎵 Music Player</h2>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={toggleDarkMode}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
            backgroundColor: darkMode ? "#0d8ddb" : "#ccc",
            color: darkMode ? "#fff" : "#222",
            transition: "background-color 0.3s ease",
          }}
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>

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
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
              animationFrameRef.current = null;
            }
          }}
        >
          Clear
        </button>
      </form>

      {videoId && (
        <div className="player-container">
          <div className="player-wrapper">
            <YouTubeThumbnail videoId={videoId} isPlaying={isPlaying} />

            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={onReady}
              onEnd={onEnd}
              onStateChange={onStateChange}
            />

            <MusicDetails videoId={videoId} />

            <MusicControls
              playerRef={playerRef}
              onToggleRepeat={toggleRepeat}
              onToggleShuffle={toggleShuffle}
              isRepeat={isRepeat}
              isShuffle={isShuffle}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />

            <Queue 
              queue={queue}
              currentTrackIndex={currentTrackIndex}
              onPlayTrack={handleTrackSelect}
              onRemoveTrack={handleRemoveTrack}
              onMoveTrackUp={(index) => {
                if (index > 0) {
                  const newQueue = [...queue];
                  [newQueue[index - 1], newQueue[index]] = [
                    newQueue[index],
                    newQueue[index - 1],
                  ];
                  setQueue(newQueue);
                  setCurrentTrackIndex(index - 1);
                }
              }}
              onMoveTrackDown={(index) => {
                if (index < queue.length - 1) {
                  const newQueue = [...queue];
                  [newQueue[index + 1], newQueue[index]] = [
                    newQueue[index],
                    newQueue[index + 1],
                  ];
                  setQueue(newQueue);
                  setCurrentTrackIndex(index + 1);
                }
              }}
              
            />

            <div className="progress-bar-container">
              <div className="progress-bar" onClick={handleProgressClick}>
                <div
                  className="progress"
                  style={{
                    width: duration
                      ? `${(currentTime / duration) * 100}%`
                      : "0%",
                  }}
                ></div>
              </div>
              <div className="time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
