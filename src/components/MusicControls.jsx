import React, { useState } from "react";
//import "./MusicControls.css";

const MusicControls = ({ playerRef }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);

  const togglePlayPause = () => {
    if (!playerRef.current) return;

    const player = playerRef.current;
    const state = player.getPlayerState();

    if (state === 1) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;

    const player = playerRef.current;

    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  return (
    <div className="music-controls">
      <button onClick={togglePlayPause}>
        {isPlaying ? "⏸ Pause" : "▶️ Play"}
      </button>
      <button onClick={toggleMute}>{isMuted ? "🔈 Unmute" : "🔇 Mute"}</button>
      <div className="volume-slider">
        <label htmlFor="volume">🔊 Volume: {volume}</label>
        <input
          id="volume"
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default MusicControls;
