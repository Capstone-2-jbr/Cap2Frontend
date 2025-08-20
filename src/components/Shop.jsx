import React, { useState, useEffect } from "react";
import ItemPreview from "./ItemPreview";
import ItemInfo from "./ItemInfo";
import axios from "axios";
import "./css/Shop.css";
import { mockListings } from "../mocklisting";

const Shop = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);


  const [search, setSearch] = useState("");
  const [decadeFilter, setDecadeFilter] = useState("");

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listingsRes = await axios.get("http://localhost:8080/api/listings");
        const mediaRes = await axios.get("http://localhost:8080/api/listingMedia");

        const listingsWithMedia = listingsRes.data.map((listing) => {
          const image = mediaRes.data.find(
            (m) => m.listing_id === listing.listing_id
          );

          const mock = mockListings.find(
            (mockItem) => mockItem.listing_id === listing.listing_id
          );

          return {
            ...listing,
            media: image?.url || mock?.media || "",
            tracks: mock?.tracks || [],
          };
        });

        setItems(listingsWithMedia);
      } catch (err) {
        console.error("Error fetching shop data:", err);
        setItems(mockListings);
      }
    };

    fetchData();
  }, []);

  function matchesSearch(item, search) {
    const text = [item.title, item.artist, item.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  }

  const albums2000s = items.slice(0, 12).filter((item) =>
    matchesSearch(item, search)
  );

  const albums2010s = items.slice(12).filter((item) =>
    matchesSearch(item, search)
  );

  return (
    <div className="shop">
      <h2>Welcome to the Shop!</h2>

      <div className="shop-controls">
        <input
          type="text"
          placeholder="Search albums..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={decadeFilter}
          onChange={(e) => setDecadeFilter(e.target.value)}
        >
          <option value="">All Items</option>
          <option value="2000s">2000s</option>
          <option value="2010s">2010s</option>
        </select>
      </div>

      {(decadeFilter === "" || decadeFilter === "2000s") && (
        <>
          <h3 className="decade-heading">2000s Albums</h3>
          <div className="shop-grid">
            {albums2000s.length > 0 ? (
              albums2000s.map((item) => (
                <ItemPreview
                  key={item.listing_id}
                  item={item}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <p>No 2000s results found.</p>
            )}
          </div>
        </>
      )}


      {(decadeFilter === "" || decadeFilter === "2010s") && (
        <>
          <h3 className="decade-heading">2010s Albums</h3>
          <div className="shop-grid">
            {albums2010s.length > 0 ? (
              albums2010s.map((item) => (
                <ItemPreview
                  key={item.listing_id}
                  item={item}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <p>No 2010s results found.</p>
            )}
          </div>
        </>
      )}

      <ItemInfo
        item={selectedItem}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default Shop;
