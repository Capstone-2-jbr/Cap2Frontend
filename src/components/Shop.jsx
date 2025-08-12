import React, { useState, useEffect } from "react";
import ItemPreview from "./ItemPreview";
import axios from "axios";
import "./css/Shop.css";

const mockListings = [
  // 2000s Albums
  {
    listing_id: 1,
    title: "The Marshall Mathers LP",
    artist: "Eminem",
    price_cents: 6500,
    media: "https://upload.wikimedia.org/wikipedia/en/a/ae/The_Marshall_Mathers_LP.jpg"
  },
  {
    listing_id: 2,
    title: "Madvillainy",
    artist: "MF Doom",
    price_cents: 3500,
    media: "https://upload.wikimedia.org/wikipedia/en/5/5e/Madvillainy_cover.png"
  },
  {
    listing_id: 3,
    title: "FutureSex/LoveSounds",
    artist: "Justin Timberlake",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/1/16/Justin_Timberlake_-_FutureSex_LoveSounds.png"
  },
  {
    listing_id: 4,
    title: "Confessions",
    artist: "Usher",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/f/f7/Usher_-_Confessions_album_cover.png"
  },
  {
    listing_id: 5,
    title: "The Chronic",
    artist: "Dr. Dre",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/1/19/Dr.DreTheChronic.jpg"
  },
  {
    listing_id: 6,
    title: "Elephant",
    artist: "The White Stripes",
    price_cents: 4500,
    media: "https://media.gq-magazine.co.uk/photos/65c62b0db4be5de0d4eb99fa/master/w_960,c_limit/00s_albums_01.jpg"
  },
  {
    listing_id: 7,
    title: "Survivor",
    artist: "Destiny's Child",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/9/99/Destiny%27s_Child_%E2%80%93_Survivor.jpg"
  },
  {
    listing_id: 7,
    title: "Speakerboxx/The Love Below",
    artist: "Outkast",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/5/54/Speakerboxxx-The_Love_Below.png"
  },
  {
    listing_id: 7,
    title: "Year of the Gentleman",
    artist: "Ne-Yo",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/3/3e/Ne-Yo_-_Closer.jpg"
  },
  {
    listing_id: 7,
    title: "Until the End of Time",
    artist: "2Pac",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/9/94/Untiltheend.jpg"
  },
  {
    listing_id: 7,
    title: "R&G (Rhythm & Gangsta): The Masterpiece",
    artist: "Snoop Dogg",
    price_cents: 4500,
    media: "https://i.scdn.co/image/ab67616d0000b273e803716268c173c3f9a0c057"
  },
  {
    listing_id: 7,
    title: "Music of the Sun",
    artist: "Rihanna",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/6/6e/Rihanna_-_Music_of_the_Sun.png"
  },

  // 2010s Albums
  {
    listing_id: 8,
    title: "Random Access Memories",
    artist: "Daft Punk",
    price_cents: 4000,
    media: "https://upload.wikimedia.org/wikipedia/en/2/26/Daft_Punk_-_Random_Access_Memories.png"
  },
  {
    listing_id: 9,
    title: "Demon Days",
    artist: "Gorillaz",
    price_cents: 3500,
    media: "https://upload.wikimedia.org/wikipedia/en/d/df/Gorillaz_Demon_Days.PNG"
  },
  {
    listing_id: 10,
    title: "To Pimp a Butterfly",
    artist: "Kendrick Lamar",
    price_cents: 2500,
    media: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png/250px-Kendrick_Lamar_-_To_Pimp_a_Butterfly.png"
  },
  {
    listing_id: 11,
    title: "The Fame",
    artist: "Lady Gaga",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/d/dd/Lady_Gaga_%E2%80%93_The_Fame_album_cover.png"
  },
  {
    listing_id: 12,
    title: "I Am... Sasha Fierce",
    artist: "Beyoncé",
    price_cents: 3200,
    media: "https://upload.wikimedia.org/wikipedia/en/4/44/Single_Ladies_%28Put_a_Ring_on_It%29_cover.png"
  },
  {
    listing_id: 7,
    title: "I Am The West",
    artist: "Ice Cube",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/6/69/Ice_Cube_-_I_Am_The_West_%28Front_Cover%29.jpg"
  },
  {
    listing_id: 7,
    title: "Scorpion",
    artist: "Drake",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/9/90/Scorpion_by_Drake.jpg"
  },
  {
    listing_id: 7,
    title: "?",
    artist: "XXXTentacion",
    price_cents: 4500,
    media: "https://i.scdn.co/image/ab67616d0000b273806c160566580d6335d1f16c"
  },
  {
    listing_id: 7,
    title: "ASTROWORLD",
    artist: "Travis Scott",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/4/4b/Travis_Scott_-_Astroworld.png"
  },
  {
    listing_id: 7,
    title: "Rodeo",
    artist: "Travis Scott",
    price_cents: 4500,
    media: "https://cdn-images.dzcdn.net/images/cover/41b8f3833e15ad11d55805556e8c7e00/1900x1900-000000-80-0-0.jpg"
  },
  {
    listing_id: 7,
    title: "Beauty Behind the Madness",
    artist: "The Weeknd",
    price_cents: 4500,
    media: "https://upload.wikimedia.org/wikipedia/en/b/bd/The_Weeknd_-_Beauty_Behind_the_Madness.png"
  },
  {
    listing_id: 7,
    title: "Artists",
    artist: "A Boogie With da Hoodie",
    price_cents: 4500,
    media: "https://t2.genius.com/unsafe/600x600/https%3A%2F%2Fimages.genius.com%2Fea2d909e09e67f5bd9e159361cb4cab0.1000x1000x1.png"
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

  const albums2000s = items.slice(0, 12);
  const albums2010s = items.slice(12);

  return (
    <div className="shop">
      <h2>Welcome to the Shop!</h2>

      <h3 className="decade-heading">2000s Albums</h3>
      <div className="shop-grid">
        {albums2000s.map((item) => (
          <ItemPreview key={item.listing_id + "-00s"} item={item} />
        ))}
      </div>

      <h3 className="decade-heading">2010s Albums</h3>
      <div className="shop-grid">
        {albums2010s.map((item) => (
          <ItemPreview key={item.listing_id + "-10s"} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
