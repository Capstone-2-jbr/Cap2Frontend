import React, {useEffect, useRef, useState} from "react";
import "../AppStyles.css";
import { Link } from "react-router-dom";

const Home = () => {
  const cardsRef = useRef([]);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setTimeout(() => {
              setVisibleCards((prev) => [...new Set([...prev, index])]);
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const cardData = [
    {
      title: "Music Player 🎵",
      desc:
        "Listen to your favorite songs via a link. You can also save your songs to a playlist.",
      link: "/musicplayer",
      button: "Listen to your heart's content",
    },
    {
      title: "Social Media 💬",
      desc:
        "Share photos, videos, and music taste with other users of Sociac!",
      link: "/socialmedia",
      button: "Socialize with friends",
    },
    {
      title: "Shop 🛒",
      desc:
        "Shop for vintage CDs, mixtapes, and even sell your own music onto the platform!",
        link: "/shop",
      button: "View offers",
    },
  ];
  return (
    <>
    <div className="description-container">
      <div className="description-card">
        <h2>Welcome to Sociac!</h2>
        <p>
          Sociac is your all-in-one space for music, socializing, and shopping. 
          Queue up your favorite tracks and keep them playing as you browse other pages. 
          Post, connect, explore — and even shop for cool music-related merch and collectibles. 
          It's your vibe, uninterrupted.
        </p>
      </div>
    </div>
    
    <div className="card-container">
  <div className="card-grid">
    {cardData.map((card, index) => (
      <div
        key={index}
        data-index={index}
        ref={(el) => (cardsRef.current[index] = el)}
        className={`card ${visibleCards.includes(index) ? "visible" : ""}`}
      >
        <h2>{card.title}</h2>
        <p>{card.desc}</p>

        {card.link ? (
          <Link to={card.link} className="card-button">
            {card.button}
          </Link>
        ) : (
          <span className="card-button">{card.button}</span>
        )}
      </div>
    ))}
  </div>
</div>
    </>
  );
};

export default Home;
