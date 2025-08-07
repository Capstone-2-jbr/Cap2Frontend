import React from "react";
import { Link } from "react-router-dom";


const ItemPreview = ({ item }) => {
  return (
    <div className="item-preview">
      <img src={item.media || "https://via.placeholder.com/150"} alt={item.title} />
      <h3>{item.title}</h3>
      <p>${(item.price_cents / 100).toFixed(2)}</p>
      <Link to={`/shop/${item.listing_id}`}>View Details</Link>
    </div>
  );
};

export default ItemPreview;
