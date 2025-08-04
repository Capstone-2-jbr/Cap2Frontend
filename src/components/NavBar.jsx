import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/NavBarStyles.css";
import "./css/AuthStyles.css";

const NavBar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      iconRef.current &&
      !iconRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Sociac</Link>
      </div>

      <div className="nav-links">
        <div style={{ position: "relative" }}>
          <div
            ref={iconRef}
            onClick={toggleDropdown}
            style={{ cursor: "pointer" }}
          >
            <img
              ref={iconRef}
              onClick={toggleDropdown}
              src={
                user && user.profileImageUrl
                  ? user.profileImageUrl
                  : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              }
              alt="User Avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
          </div>
          {isOpen && (
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                top: "45px",
                right: "0",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                zIndex: 1000,
                width: "260px",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <img
                  src={
                    user?.profileImageUrl ||
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  }
                  alt="Profile"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "0.75rem",
                  }}
                />
                <div>
                  <strong style={{ display: "block" }}>
                    {user?.username || "Guest"}
                  </strong>
                  <span style={{ fontSize: "0.875rem", color: "#666" }}>
                    {user?.email || "Not logged in"}
                  </span>
                </div>
              </div>
              {user ? (
                <>
                  <Link to="/profile" className="nav-dropdown-link">
                    ✏️ Edit Profile
                  </Link>
                  <button
                    onClick={onLogout}
                    className="nav-dropdown-link"
                    style={{
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      width: "100%",
                      cursor: "pointer",
                      padding: "0.75rem 1rem",
                    }}
                  >
                    🚪 Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/MusicPlayer" className="nav-dropdown-link">
                    🎵 Music Player
                  </Link>
                  <Link to="/login" className="nav-dropdown-link">
                    🔐 Login
                  </Link>
                  <Link to="/signup" className="nav-dropdown-link">
                    ✍️ Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
