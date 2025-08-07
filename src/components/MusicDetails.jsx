import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/MusicDetails.css";
import { API_URL } from "../shared";

const MusicDetails = ({ videoId }) => {
  const [details, setDetails] = useState(null);
  console.log("Video ID passed to MusicDetails:", videoId);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!videoId) return;

    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/video-details/${videoId}`
        );
        setDetails(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching video details:", error);
        setError("Failed to load video details.");
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  if (error) return <div>{error}</div>;
  if (!details) return <div>Loading video details...</div>;

  const { title, channelTitle, thumbnails, publishedAt } = details.snippet;

  return (
    <div className="music-details">
      <div className="info">
        <h2>{title}</h2>
        <p>By: {channelTitle}</p>
        <p>Published: {new Date(publishedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default MusicDetails;
