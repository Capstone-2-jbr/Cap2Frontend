import React from "react";

const Playlist = ({ playlist, onPlayTrack }) => {
    return (
        <div className="playlist-container">
        <h2>📂 {playlist.name}</h2>
        <ul className="playlist-tracks">
            {playlist.tracks.map((track, index) => (
            <li key={index} onClick={() => onPlayTrack(track.id)}>
                <img src={track.thumbnail} alt="Thumbnail" className="track-thumbnail" />
                <div className="track-title">{track.title}</div>
            </li>
            ))}
        </ul>
        </div>
    );
    }
export default Playlist;