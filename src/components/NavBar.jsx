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
  <div className="nav-left">
    <Link to="/" className="nav-brand jewels-font">
      Sociac
    </Link>
  </div>

  <div className="nav-center">
    <Link to="/musicplayer" className="nav-link">Music Player</Link>
    <Link to="/socialmedia" className="nav-link">Social Media</Link>
    <Link to="/shop" className="nav-link">Shop</Link>
  </div>

  <div className="nav-right">
    <img
      ref={iconRef}
      onClick={toggleDropdown}
      className="profile-icon"
      src={
        user?.profileImageUrl ||
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
      }
      alt="Profile"
    />

    {isOpen && (
      <div ref={dropdownRef} className="dropdown-menu">
        <div className="user-info">
          <strong>{user?.username || "Guest"}</strong>
          <div className="user-email">{user?.email || "Not logged in"}</div>
        </div>

        {user ? (
          <>
            <Link to="/profile" className="nav-dropdown-link">✏️ Edit Profile</Link>
            <button onClick={onLogout} className="nav-dropdown-link logout-btn">
              🚪 Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/musicplayer" className="nav-dropdown-link">🎵 Music Player</Link>
            <Link to="/login" className="nav-dropdown-link">🔐 Login</Link>
            <Link to="/signup" className="nav-dropdown-link">✍️ Sign Up</Link>
          </>
        )}
      </div>
    )}
  </div>
</nav>
);

};

export default NavBar;
