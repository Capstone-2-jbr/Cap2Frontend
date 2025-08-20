import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "./css/ViewProfile.css";

const ViewProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    console.log("Fetching profile for userId:", userId);
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/users/profile/${userId}`,
        { withCredentials: true }
      );
      setProfile(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load profile");
      console.error("Error fetching profile:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  if (loading) return <div className="view-profile-loading">Loading...</div>;
  if (error) return <div className="view-profile-error">{error}</div>;
  if (!profile) return <div className="view-profile-empty">No profile found.</div>;

  return (
    <div className="view-profile-container">
      <div className="view-profile-card">
        {/* Profile Avatar */}
        <div className="view-profile-avatar">
          <span>{profile.username?.[0]?.toUpperCase() || "U"}</span>
        </div>

        {/* User Info */}
        <h1 className="view-profile-username">{profile.username}</h1>
        <p className="view-profile-email">{profile.email}</p>

        {profile.bio ? (
          <p className="view-profile-bio">{profile.bio}</p>
        ) : (
          <p className="view-profile-bio muted">No bio added yet.</p>
        )}

        {/* Divider */}
        <hr className="view-profile-divider" />

        {/* Edit Profile Button */}
        <Link to="/profile" className="view-profile-edit-btn">
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default ViewProfile;
