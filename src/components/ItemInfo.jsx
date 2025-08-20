import React from "react";
import Modal from "./Modal";
import "./css/Shop.css";
import { useCart } from "./CartContext";

const ItemInfo = ({ item, isOpen, onClose }) => {
  const { addItem } = useCart();
  if (!item) return null;
  const handleAdd = async () => {
    await addItem(item.listing_id, 1);
    alert("Added to cart!");
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} position="center">
      <div className="item-details-grid">
        <div className="item-left">
          <div className="cd-wrapper">
            <img src={item.media} alt={item.title} />
          </div>
          <h2 className="shop-item-title">{item.title}</h2>
          {item.artist && <h3 className="shop-item-artist">{item.artist}</h3>}
          <p className="item-details-price">
            ${(item.price_cents / 100).toFixed(2)}
          </p>
          <p className="item-details-description">
            {item.description || "No description provided."}
          </p>
          <div className="modal-actions">
            <button className="addCart" onClick={handleAdd}>
            Add to Cart
          </button>
          <button className="shop-item-close" onClick={onClose}>
            Close
          </button>

          </div>

        </div>

        <div className="item-right">
          {item.tracks && item.tracks.length > 0 && (
            <>
              <h3>Tracklist</h3>
              <ol>
                {item.tracks.map((track, idx) => (
                  <li key={idx}>{track}</li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
export default ItemInfo;