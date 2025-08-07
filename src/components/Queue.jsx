import React from "react";
import "./css/Queue.css";

const Queue = ({
  queue,
  currentTrackIndex,
  onPlayTrack,
  onRemoveTrack,
}) => {
  return (
    <div className="queue-container">
      <h2>🎶 Queue</h2>
      <ul className="queue-list">
        {queue.map((track, index) => (
          <li
            key={track.id || index}
            className={index === currentTrackIndex ? "active" : ""}
          >
            <div
              className="track-title"
              onClick={() => onPlayTrack(track.id)}
              title="Click to play"
            >
              {track.title}
            </div>

            <div className="queue-actions">

              <button onClick={() => onRemoveTrack(index)}>🗑</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Queue;
