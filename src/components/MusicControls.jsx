import React, { useState } from "react";
//import "./MusicControls.css";

const MusicControls = ({ playerRef }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [prevVolume, setPrevVolume] = useState(100); 

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
      player.setVolume(prevVolume);
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      player.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);

    if (!playerRef.current) return;
    const player = playerRef.current;

    player.setVolume(newVolume);

    if (newVolume === 0) {
      player.mute();
      setIsMuted(true);
    } else {
      player.unMute();
      setIsMuted(false);
      setPrevVolume(newVolume);
    }
  };

  const skipForward = () => {
    if (playerRef.current) {
      const player = playerRef.current;
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime + 10, true);
    }
  };

  const skipBackward = () => {
    if (playerRef.current) {
      const player = playerRef.current;
      const currentTime = player.getCurrentTime();
      player.seekTo(Math.max(0, currentTime - 10), true);
    }
  };

  return (
    <div className="music-controls">
      <button onClick={skipBackward}>⏪ 10s</button>
      <button onClick={togglePlayPause}>
        {isPlaying ? "⏸ Pause" : "▶️ Play"}
      </button>
      <button onClick={skipForward}>⏩ 10s</button>

      <button onClick={toggleMute}>
        {isMuted ? "🔈 Unmute" : "🔇 Mute"}
      </button>

      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
};

export default MusicControls;
