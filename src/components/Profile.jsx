import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "./css/Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchProfile = async () => {
    console.log("Fetching profile for userId:", userId);
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/users/profile/${userId}`,
        { withCredentials: true }
      );
      setFormData({
        username: response.data.username || "",
        email: response.data.email || "",
        bio: response.data.bio || "",
      });
      setLoading(false);
    } catch (error) {
      setError("Failed to load profile");
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setSuccessMsg(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/users/profile`, formData, {
        withCredentials: true,
      });
      setSuccessMsg("✅ Profile updated successfully!");
    } catch (err) {
      setError("❌ Failed to update profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Edit Your Profile</h1>

        {error && <div className="error-msg">{error}</div>}
        {successMsg && <div className="success-msg">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <label className="profile-label">
            Username
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="profile-input"
            />
          </label>

          <label className="profile-label">
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="profile-input"
            />
          </label>

          <label className="profile-label">
            Bio
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="profile-textarea"
            />
          </label>

          <button type="submit" className="profile-submit-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
