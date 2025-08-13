import React from "react";
import "./css/Shop.css";

const ItemPreview = ({ item, onViewDetails }) => {
  return (
    <div className="shop-item">
      <div className="cd-wrapper">
        <img src={item.media} alt={item.title} />
      </div>
      <h3 className="shop-item-title">{item.title}</h3>
      {item.artist && <p className="by-artist">by {item.artist}</p>}
      <p className="shop-item-price">${(item.price_cents / 100).toFixed(2)}</p>
      <button className="view-details" onClick={() => onViewDetails(item)}>View Details</button>
    </div>
  );
};

export default ItemPreview;
