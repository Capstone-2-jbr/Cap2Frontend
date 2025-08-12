import React, { useState, useRef, useEffect } from "react";
import "./css/SocialMedia.css";

const CreatePost = ({ onCreate, isOpen, onClose }) => {
  const [media, setMedia] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const mediaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => mediaRef.current?.focus(), 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    onClose();
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <div className="create-post-header">
        <h3 id="create-post">Create a Post</h3>
        <button
          type="button"
          className="icon-btn close-btn"
          aria-label="Close"
          onClick={onClose}
        >
          X
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      <input
        ref={mediaRef}
        type="text"
        placeholder="Link your photo/video."
        value={media}
        onChange={(e) => setMedia(e.target.value)}
        className="create-post-input"
        rows={2}
      />
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="create-post-textarea"
        rows={3}
      />
      <button type="submit" className="create-post-btn">
        Post
      </button>
    </form>
  );
};

export default CreatePost;
