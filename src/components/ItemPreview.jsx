import React from "react";
import "./css/Shop.css";
import { useCart } from "./CartContext";

const ItemPreview = ({ item, onViewDetails }) => {
  const { addItem } = useCart();
  

  return (
    <div className="shop-item">
      <div className="cd-wrapper">
        <img src={item.media} alt={item.title} />
      </div>
      <h3 className="shop-item-title">{item.title}</h3>
      {item.artist && <p className="by-artist">by {item.artist}</p>}
      <p className="shop-item-price">${(item.price_cents / 100).toFixed(2)}</p>

      <button className="add-to-cart" onClick={() => addItem(item.listing_id,1)}>
        Add to Cart
      </button>

      <button className="view-details" onClick={() => onViewDetails(item)}>
        View Details
      </button>
    </div>
  );
};

export default ItemPreview;
