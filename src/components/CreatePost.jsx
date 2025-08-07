import React, { useState } from "react";
import "./css/SocialMedia.css";

const CreatePost = ({ onCreate }) => {
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !content.trim()) {
      setError("Both fields are required.");
      return;
    }
    onCreate({ username, content });
    setUsername("");
    setContent("");
    setError("");
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <h3>Create a Post</h3>
      {error && <div className="error-message">{error}</div>}
      <input
        type="text"
        placeholder="Your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="create-post-input"
      />
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="create-post-textarea"
        rows={3}
      />
      <button type="submit" className="create-post-btn">Post</button>
    </form>
  );
};

export default CreatePost;
