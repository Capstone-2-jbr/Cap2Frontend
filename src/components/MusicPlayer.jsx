import React, { useState } from "react";
import YouTube from "react-youtube";
import { getYouTubeVideoId } from "../utils/getVideoIdFromUrl";

const MusicPlayer = () => {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = getYouTubeVideoId(url);
    if (id) {
      setVideoId(id);
    } else {
      alert("Invalid YouTube link");
    }
  };

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="music-player-page">
      <h2>🎵 YouTube Music Player</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Paste YouTube URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Play</button>
      </form>

      {videoId && (
        <div className="youtube-player">
          <YouTube videoId={videoId} opts={opts} />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
