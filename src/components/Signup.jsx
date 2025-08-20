import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./css/AuthStyles.css";
import { API_URL } from "../shared";

const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = "Username must be between 3 and 20 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/auth/signup`,
        {
          username: formData.username,
          password: formData.password,
        },
        { withCredentials: true }
      );

      setUser(response.data.user);
      try {
        const userResponse = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });
        setUser(userResponse.data.user);
      } catch (fetchError) {
        console.log("Could not fetch updated user data:", fetchError);
      }

      navigate("/");
    } catch (error) {
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: "An error occurred during signup" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        minHeight: "calc(100vh - var(--navbar-height, 64px))",
        width: "100%",
        padding: 0,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
        gap: 0,
      }}
    >
      <section
        style={{
          flex: "0 1 48%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "clamp(2rem, 6vw, 7rem)",
          paddingRight: "clamp(1rem, 3vw, 2rem)",
        }}
      >
        <div
          className="auth-form"
          style={{
            background: "transparent",
            border: "none",
            boxShadow: "none",
            width: "min(420px, 92%)",
            padding: "2rem",
          }}
        >
          <h2>Sign Up</h2>

          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "error" : ""}
              />
              {errors.username && (
                <span className="error-text">{errors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error" : ""}
              />
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </section>

      <aside
        style={{
          position: "relative",
          flex: "1 1 82%",
          minHeight: "100%",
          overflow: "hidden",
        }}
      >
        <img
          alt="Signup illustration"
          src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?_gl=1*bead1k*_ga*MTAxOTQwMTg5MC4xNzU1NjU5MDI4*_ga_8JE65Q40S6*czE3NTU2NTkwMjgkbzEkZzEkdDE3NTU2NTkwNDUkajQzJGwwJGgw"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </aside>
    </div>
  );
};

export default Signup;
