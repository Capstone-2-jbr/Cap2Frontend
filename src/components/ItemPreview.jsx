import React from "react";
import "./css/Shop.css";
import { useCart } from "./CartContext";

const ItemPreview = ({ item, onViewDetails }) => {
  const { addItem } = useCart();

  const [toast, setToast] = React.useState(null);
  const showToast = (msg, type = "info", ms = 2200) => {
    setToast({ msg, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), ms);
  };

  async function handleAdd() {
    try {
      await addItem(item.listing_id, 1);
      showToast("✅ Added to cart!", "success");
    } catch (err) {
      console.error("Failed to add item:", err);
      showToast("❌ Failed to add to cart", "error");
    }
  }

  return (
    <>
      {toast && <div className={`cart-toast ${toast.type}`}>{toast.msg}</div>}

      <div className="shop-item">
        <div className="cd-wrapper">
          <img src={item.media} alt={item.title} />
        </div>
        <h3 className="shop-item-title">{item.title}</h3>
        {item.artist && <p className="by-artist">by {item.artist}</p>}
        <p className="shop-item-price">${(item.price_cents / 100).toFixed(2)}</p>

        <button className="add-to-cart" onClick={handleAdd}>
          Add to Cart
        </button>

        <button className="view-details" onClick={() => onViewDetails(item)}>
          View Details
        </button>
      </div>
    </>
  );
};

export default ItemPreview;
