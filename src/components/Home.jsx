import React from "react";
import "../AppStyles.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
    <div className="description-container">
      <div className="card">
        <h2>Welcome to Sociac!</h2>
        <p>This platform offers you the ability to use a music player, social media, and shop for all your music needs.
          This site will also allow you to play music and have it still play when your browsing other pages.
        </p>
      </div>
    </div>
    
    <div className="card-container">
      <div className="card-grid">
      <div className="card">
        <h2>Music Player</h2>
        <p>Listen to your favorite songs via a link. You can also save your songs to a playlists if you'd like.</p>
        <button><Link to="/MusicPlayer">
        Listen to your hearts content
        </Link>
        </button>
      </div>
    </div>
     <div>
      <div className="card">
        <h2>Social Media</h2>
        <p>Share photos, videos, and music taste with other users of Sociac!</p>
        <button>Socialize with friends</button>
      </div>

    </div>
     <div>
      <div className="card">
        <h2>Shop</h2>
        <p>Shop for vintage cds, mixtapes, and even sell your own music onto the platform!</p>
        <button>View offers</button>
      </div>
    </div>

    </div>
    </>
  );
};

export default Home;
