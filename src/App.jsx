import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import PlaylistPage from "./components/PlaylistPage";
import NotFound from "./components/NotFound";
import MusicPlayer from "./components/MusicPlayer";
import SocialMedia from "./components/SocialMedia";
import CreatePost from "./components/CreatePost";
import Shop from "./components/Shop";
import CartPage from "./components/CartPage";
import { CartProvider } from "./components/CartContext";
import { ThemeProvider } from "./components/ThemeContext";
import Profile from "./components/Profile";
import ViewProfile from "./components/ViewProfile";
import { API_URL } from "./shared";
axios.defaults.withCredentials = true;

const App = () => {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [queue, setQueue] = useState([]);
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
      console.log("Authenticated user:", response.data.user);
    } catch {
      console.log("Not authenticated");
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <ThemeProvider>
        <CartProvider user={user}>
          <NavBar user={user} onLogout={handleLogout} />
          <div className={`app ${isAuthPage ? "app--fullbleed" : ""}`}>
            <Routes>
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/viewprofile/:userId" element={<ViewProfile />} />

              <Route
                path="/PlaylistPage"
                element={
                  <PlaylistPage
                    user={user}
                    playlists={playlists}
                    setPlaylists={setPlaylists}
                  />
                }
              />
              <Route path="/MusicPlayer" element={<MusicPlayer />} />
              <Route path="/socialmedia" element={<SocialMedia />} />
              <Route path="/socialmedia/createpost" element={<CreatePost />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/cart" element={<CartPage />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/signup" element={<Signup setUser={setUser} />} />
              <Route exact path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          {!isAuthPage && (
            <footer className="footer">
              <p>
                &copy; {new Date().getFullYear()} Sociac. All rights reserved.
              </p>
            </footer>
          )}
        </CartProvider>
      </ThemeProvider>
    </div>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
