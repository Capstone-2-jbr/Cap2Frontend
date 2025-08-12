import React from "react";
import { Link } from "react-router-dom";


const ItemPreview = ({ item }) => {
  return (
    <div className="shop-item">
      <img src={item.media || "https://via.placeholder.com/150"} alt={item.title} />
      <h3>{item.title}</h3>
      <h4>{item.artist}</h4>
      <p>${(item.price_cents / 100).toFixed(2)}</p>
      <Link to={`/shop/${item.listing_id}`}>View Details</Link>
    </div>
  );
};

export default ItemPreview;
