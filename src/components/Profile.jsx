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
  const { userId } = useParams(); // Assuming userId is passed in the URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchProfile = async () => {
    console.log("Fetching profile for userId:", userId);
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/users/profile/${userId}`,
        {
          withCredentials: true,
          //params: { id: userId },
        }
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

  //   const fetchProfile = async () => {
  //     await axios.get(`${API_URL}/api/users/profile`, { withCredentials: true })
  //     .then((res) => {
  //         if (!res.data) {
  //           setError("No profile data found", res.data);
  //           setLoading(false);
  //           return;
  //         }
  //         setFormData({
  //           username: res.data.username || "",
  //           email: res.data.email || "",
  //           bio: res.data.bio || "",
  //         });
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         setError("Failed to load profile");
  //         setLoading(false);
  //       });
  //   };

  //

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
      setSuccessMsg("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      {error && <div className="error-msg">{error}</div>}
      {successMsg && <div className="success-msg">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="profile-form">
        <label>
          Username:
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Bio:
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
        </label>

        <button type="submit" className="profile-submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
