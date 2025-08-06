import React, { useState } from "react";
import "./css/MusicControls.css";

const MusicControls = ({ playerRef }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [prevVolume, setPrevVolume] = useState(100);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const player = playerRef?.current;

  const togglePlayPause = () => {
    if (!player) return;
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
    if (!player) return;
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
    if (!player) return;
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
    if (player) player.seekTo(player.getCurrentTime() + 10, true);
  };

  const skipBackward = () => {
    if (player) player.seekTo(Math.max(0, player.getCurrentTime() - 10), true);
  };

  const toggleRepeat = () => setIsRepeat(!isRepeat);
  const toggleShuffle = () => setIsShuffle(!isShuffle);

  return (
    <div className="music-controls-container">
      <div className="controls-row main-controls">
        <button onClick={skipBackward}>⏮</button>
        <button onClick={togglePlayPause}>
          {isPlaying ? "⏸" : "▶️"}
        </button>
        <button onClick={skipForward}>⏭</button>
      </div>

      <div className="controls-row toggle-controls">
        <button
          onClick={toggleShuffle}
          className={isShuffle ? "active" : ""}
        >
          🔀
        </button>
        <button
          onClick={toggleRepeat}
          className={isRepeat ? "active" : ""}
        >
          🔁
        </button>
        <button onClick={toggleMute}>
          {isMuted ? "🔈" : "🔇"}
        </button>
      </div>

      <div className="controls-row volume-control">
        <input
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
