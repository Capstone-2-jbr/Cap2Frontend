import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/NavBarStyles.css";
import "./css/AuthStyles.css";

const NavBar = ({ user, onLogout }) => {
  const { pathname } = useLocation();
  const [activePath, setActivePath] = useState(pathname);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  // Keep activePath in sync with actual route
  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

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

  // Close dropdown on outside click
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Ensures instant highlight change
  const handleNavClick = (path) => {
    setActivePath(path);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand jewels-font" onClick={() => handleNavClick("/")}>
          Sociac
        </Link>
      </div>

      <div className="nav-center">
        <Link
          to="/musicplayer"
          className={`nav-link${activePath === "/musicplayer" ? " active" : ""}`}
          onClick={() => handleNavClick("/musicplayer")}
        >
          Music Player
        </Link>
        <Link
          to="/socialmedia"
          className={`nav-link${activePath === "/socialmedia" ? " active" : ""}`}
          onClick={() => handleNavClick("/socialmedia")}
        >
          Social Media
        </Link>
        <Link
          to="/shop"
          className={`nav-link${activePath === "/shop" ? " active" : ""}`}
          onClick={() => handleNavClick("/shop")}
        >
          Shop
        </Link>
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
                <Link to="/profile" className="nav-dropdown-link" onClick={() => setIsOpen(false)}>
                  ✏️ View Profile
                </Link>
                <button onClick={onLogout} className="nav-dropdown-link logout-btn">
                  🚪 Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-dropdown-link" onClick={() => setIsOpen(false)}>
                  🔐 Login
                </Link>
                <Link to="/signup" className="nav-dropdown-link" onClick={() => setIsOpen(false)}>
                  ✍️ Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
