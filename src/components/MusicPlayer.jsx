import React, { useState, useRef } from "react";
import YouTube from "react-youtube";
import MusicControls from "../components/MusicControls";
import { getYouTubeVideoId } from "../utils/getVideoIdFromUrl";
import "./MusicPlayer.css";

const MusicPlayer = () => {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const playerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = getYouTubeVideoId(url);
    if (id) {
      setVideoId(id);
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

  const onReady = (event) => {
    playerRef.current = event.target;
  };

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
            if (playerRef.current) playerRef.current.stopVideo();
          }}
        >
          Clear
        </button>
      </form>

      {videoId && (
        <div className="player-wrapper">
          <YouTube videoId={videoId} opts={opts} onReady={onReady} />
          <MusicControls playerRef={playerRef} />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
