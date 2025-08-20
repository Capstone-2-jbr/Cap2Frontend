import React from "react";
import "./css/Queue.css";
import { getYouTubeVideoId } from "../utils/getVideoIdFromUrl";

const Queue = ({
  queue,
  currentTrackIndex,
  onPlay, 
  onRemoveTrack,
}) => {
  return (
    <div className="queue-container">
      <h2>🎶 Queue</h2>
      <ul className="queue-list">
        {queue.map((track, index) => {
          const videoId = getYouTubeVideoId(track.url || "");
          const thumbnail = videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : null; // 🔥 upgraded from "default.jpg" → "hqdefault.jpg" for clearer thumbnail

          return (
            <li
              key={track.id || index}
              className={index === currentTrackIndex ? "active" : ""}
            >
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={track.title || `Track ${index + 1}`}
                  className="queue-thumbnail"
                  onClick={() => onPlay && onPlay(index)}  
                  title="Click to play"
                />
              )}

              <div
                className="track-title"
                onClick={() => onPlay && onPlay(index)}  
                title="Click to play"
              >
                {track.title || `Track ${index + 1}`}
              </div>

              <div className="queue-actions">
                <button onClick={() => onRemoveTrack(index)}>🗑</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Queue;
