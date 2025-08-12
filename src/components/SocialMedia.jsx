import React, { useState } from "react";
import "./css/SocialMedia.css";
import Modal from "./Modal";
import CreatePost from "./CreatePost";

const mockPosts = [
  { id: 1, username: "alice", content: "Just finished a great book!" },
  { id: 2, username: "bob", content: "Loving the new music player!" },
  { id: 3, username: "carol", content: "Anyone up for a chat?" },
  { id: 4, username: "dave", content: "Check out my new blog post." },
  { id: 5, username: "eve", content: "React is awesome!" },
  { id: 6, username: "frank", content: "What are you listening to?" },
  { id: 7, username: "grace", content: "Happy Friday everyone!" },
];

const SocialMedia = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");

  const allPosts = [...posts, ...mockPosts];
  const filteredPosts = allPosts.filter(
    (post) =>
      post.username.toLowerCase().includes(filter.toLowerCase()) ||
      post.content.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="socialcontainer">
      <h2>Social Media Feed</h2>
      <div className="socialheader">
        <input
          type="text"
          className="searchbar"
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          className="CreatePost"
          onClick={() => setIsCreateOpen(true)}
        >
          Create Post
        </button>
      </div>

      <div className="socialgrid">
        {filteredPosts.length === 0 ? (
          <div className="noposts">No posts found.</div>
        ) : (
          filteredPosts.map((post) => (
            <div className="socialcard" key={post.id}>
              <strong>@{post.username}</strong>
              <p className="socialcontent">{post.content}</p>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        position="center"
      >
        <CreatePost
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={(newPost) => {
            setPosts((prev) => [
              { id: Date.now(), username: "you", ...newPost },
              ...prev,
            ]);
          }}
        />
      </Modal>
    </div>
  );
};

export default SocialMedia;
