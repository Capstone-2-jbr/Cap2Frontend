import React, { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import MusicControls from "../components/MusicControls";
import MusicDetails from "./MusicDetails";
import Queue from "./Queue";
//import {getYoutubeThumbnail} from "../utils/getYoutubeThumbnail";
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
  const [playlists, setPlaylists] = useState([]);

  const playerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = getYouTubeVideoId(url);
    if (id) {
      const existingTrack = queue.find((track) => track.id === id);
      if (existingTrack) {
        const index = queue.findIndex((track) => track.id === id);
        setCurrentTrackIndex(index);
        setVideoId(id);
      } else {
        setVideoId(id);
      }
      setUrl("");
    } else {
      alert("Invalid YouTube URL");
    }
  };

  // New function to add song to queue without playing
  const handleAddToQueue = (e) => {
    e.preventDefault();
    const id = getYouTubeVideoId(url);
    if (id) {
      const exists = queue.some((track) => track.id === id);
      if (!exists) {
        const newTrack = { id, title: `Track ${queue.length + 1}` };
        setQueue((prev) => [...prev, newTrack]);
      } else {
        alert("Track already in queue");
      }
      setUrl("");
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const onReady = async (event) => {
    const player = event.target;
    playerRef.current = player;
    setDuration(player.getDuration());

    // Fetch title from YouTube player
    const videoData = player.getVideoData();
    const title = videoData?.title || `Track ${queue.length + 1}`;
    const id = player.getVideoUrl().split("v=")[1]?.split("&")[0];

    const exists = queue.some((track) => track.id === id);
    if (!exists) {
      const newTrack = { id, title };
      setQueue((prev) => [...prev, newTrack]);
      setCurrentTrackIndex(queue.length);
    } else {
      const index = queue.findIndex((track) => track.id === id);
      setCurrentTrackIndex(index);
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (player.getPlayerState() === 1) {
      animationFrameRef.current = requestAnimationFrame(updateTime);
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

  const onEnd = () => {
    if (isRepeat && playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
    } else if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      const nextTrack = queue[randomIndex];
      setVideoId(nextTrack.id);
      setCurrentTrackIndex(randomIndex);
    } else {
      const nextIndex = currentTrackIndex + 1;
      if (nextIndex < queue.length) {
        setVideoId(queue[nextIndex].id);
        setCurrentTrackIndex(nextIndex);
      }
    }
  };

  const handleTrackSelect = (index) => {
    const track = queue[index];
    if (track) {
      setVideoId(track.id);
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
          setVideoId(newQueue[nextIndex].id);
          setCurrentTrackIndex(nextIndex);
        }
      } else if (index < currentTrackIndex) {
        setCurrentTrackIndex((prev) => prev - 1);
      }

      return newQueue;
    });
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

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      controls: 0,
    },
  };

  return (
    <div className={`music-player-page ${darkMode ? "dark-mode" : "light-mode"}`}>
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
        <button type="button" onClick={handleAddToQueue}>
          Add to Queue
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
              onPlay
              currentTrackIndex={currentTrackIndex}
              onPlayTrack={handleTrackSelect}
              onRemoveTrack={handleRemoveTrack}
            />

            <div className="progress-bar-container">
              <div className="progress-bar" onClick={handleProgressClick}>
                <div
                  className="progress"
                  style={{
                    width: duration ? `${(currentTime / duration) * 100}%` : "0%",
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
