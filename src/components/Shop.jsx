
import React, { useState, useEffect } from "react";
import ItemPreview from "./ItemPreview";
import axios from "axios";
import "./css/Shop.css";

const mockListings = [
  {
    listing_id: 1,
    title: "Graduation",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/7/70/Graduation_%28album%29.jpg"
  },
  {
    listing_id: 2,
    title: "Random Access Memories",
    price_cents: 4000,
    media: "https://upload.wikimedia.org/wikipedia/en/2/26/Daft_Punk_-_Random_Access_Memories.png"
  },
  {
    listing_id: 3,
    title: "Demon Days",
    price_cents: 3500,
    media: "https://upload.wikimedia.org/wikipedia/en/d/df/Gorillaz_Demon_Days.PNG"
  },
  {
    listing_id: 4,
    title: "To Pimp a Butterfly",
    price_cents: 2500,
    media: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png/250px-Kendrick_Lamar_-_To_Pimp_a_Butterfly.png"
  },
  {
    listing_id: 5,
    title: "The Fame",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/d/dd/Lady_Gaga_%E2%80%93_The_Fame_album_cover.png"
  },
  {
    listing_id: 6,
    title: "I Am... Sasha Fierce",
    price_cents: 3200,
    media: "https://upload.wikimedia.org/wikipedia/en/4/44/Single_Ladies_%28Put_a_Ring_on_It%29_cover.png"
  },
];



const Shop = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/listings")
      .then((res) => setItems(res.data))
      .catch((err) => {
        console.error("Failed to fetch listings:", err);
        setItems(mockListings);
      });
  }, []);

  return (
    <div className="shop">
      <h2>Welcome to the Shop!</h2>
      <h3>2010s Albums</h3>
      <div className="shop-grid">
        {items.map((item) => (
          <ItemPreview key={item.listing_id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
