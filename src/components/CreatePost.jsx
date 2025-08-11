import React, { useState } from "react";
import "./css/SocialMedia.css";

const CreatePost = ({ onCreate }) => {
  const [media, setMedia] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!media.trim() || !content.trim()) {
      setError("Both fields are required.");
      return;
    }
    onCreate({ media, content });
    setMedia("");
    setContent("");
    setError("");
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <h3>Create a Post</h3>
      {error && <div className="error-message">{error}</div>}
      <input
        type="text"
        placeholder="Link your photo/video."
        value={media}
        onChange={(e) => setMedia(e.target.value)}
        className="create-post-input" rows={2}
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
