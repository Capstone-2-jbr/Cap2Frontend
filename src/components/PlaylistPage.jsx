import React, { useState, useEffect } from "react";
import { API_URL } from "../shared";
import "./css/PlaylistPage.css";
import axios from "axios";

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For create/update form
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [playlistName, setPlaylistName] = useState("");
  const [items, setItems] = useState([{ title: "", url: "" }]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/playlists`);
      setPlaylists(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching playlists:", err);
      setError("Failed to fetch playlists");
      setLoading(false);
    }
  };

  const addItemInput = () => setItems([...items, { title: "", url: "" }]);
  const removeItemInput = (index) => setItems(items.filter((_, i) => i !== index));
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const resetForm = () => {
    setEditingPlaylist(null);
    setPlaylistName("");
    setItems([{ title: "", url: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedItems = items.map((item, index) => ({
        title: item.title,
        youtube_url: item.url,
        position: index + 1,
      }));

      if (editingPlaylist) {
        await axios.patch(
          `${API_URL}/api/playlists/${editingPlaylist.playlist_id}`,
          { name: playlistName, items: formattedItems },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${API_URL}/api/playlists/`,
          { name: playlistName, items: formattedItems },
          { withCredentials: true }
        );
      }

      resetForm();
      fetchPlaylists();
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to save playlist");
    }
  };

  const handleEdit = (playlist) => {
    setEditingPlaylist(playlist);
    setPlaylistName(playlist.name || "");
    const formattedItems =
      playlist.items && playlist.items.length > 0
        ? playlist.items.map((item) => ({
            title: item.title_cache || item.title || "",
            url: item.youtube_url || item.url || "",
          }))
        : [{ title: "", url: "" }];
    setItems(formattedItems);
  };

  const handleDelete = async (playlist_id) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    try {
      await axios.delete(`${API_URL}/api/playlists/${playlist_id}`);
      fetchPlaylists();
    } catch (err) {
      setError("Failed to delete playlist");
    }
  };

  return (
    <div className="playlist-page">
      <h1>Playlists</h1>

      {loading && <p>Loading playlists...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul className="playlist-list">
        {playlists.map((playlist) => (
          <li key={playlist.playlist_id} className="playlist-item">
            <div className="playlist-header">
              <strong>{playlist.name}</strong>
              <div>
                <button onClick={() => handleEdit(playlist)}>Edit</button>
                <button onClick={() => handleDelete(playlist.playlist_id)}>Delete</button>
              </div>
            </div>

            <ul className="song-list">
              {playlist.items &&
                playlist.items
                  .sort((a, b) => (a.position || 0) - (b.position || 0))
                  .map((item, i) => (
                    <li key={i}>
                      {item.title_cache || item.title} -{" "}
                      <a href={item.youtube_url || item.url} target="_blank" rel="noreferrer">
                        {item.youtube_url || item.url}
                      </a>
                    </li>
                  ))}
            </ul>

            {/* Inline editing form */}
            {editingPlaylist && editingPlaylist.playlist_id === playlist.playlist_id && (
              <form className="playlist-form" onSubmit={handleSubmit}>
                <label>
                  Playlist Name:
                  <input
                    type="text"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    required
                  />
                </label>

                <h3>Items</h3>
                {items.map((item, index) => (
                  <div className="item-row" key={index}>
                    <input
                      type="text"
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => handleItemChange(index, "title", e.target.value)}
                      required
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={item.url}
                      onChange={(e) => handleItemChange(index, "url", e.target.value)}
                      required
                    />
                    {items.length > 1 && (
                      <button type="button" className="remove-btn" onClick={() => removeItemInput(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button type="button" onClick={addItemInput}>
                  Add Item
                </button>

                <div className="submit-row">
                  <button type="submit">Update Playlist</button>
                  <button type="button" className="cancel-btn" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>

      {/* Create new playlist form at the bottom */}
      {!editingPlaylist && (
        <form className="playlist-form" onSubmit={handleSubmit}>
          <h2>Create New Playlist</h2>
          <label>
            Playlist Name:
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              required
            />
          </label>

          <h3>Items</h3>
          {items.map((item, index) => (
            <div className="item-row" key={index}>
              <input
                type="text"
                placeholder="Title"
                value={item.title}
                onChange={(e) => handleItemChange(index, "title", e.target.value)}
                required
              />
              <input
                type="url"
                placeholder="URL"
                value={item.url}
                onChange={(e) => handleItemChange(index, "url", e.target.value)}
                required
              />
              {items.length > 1 && (
                <button type="button" className="remove-btn" onClick={() => removeItemInput(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addItemInput}>
            Add Item
          </button>

          <div className="submit-row">
            <button type="submit">Create Playlist</button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PlaylistPage;
