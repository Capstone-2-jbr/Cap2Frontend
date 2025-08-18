import React from "react";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";
import "./css/Cart.css";

const fmt = (cents) => (cents / 100).toFixed(2);

function QtyStepper({ value, onChange }) {
  return (
    <div className="qty-stepper">
      <button onClick={() => onChange(Math.max(1, value - 1))}>-</button>
      <input
        type="number"
        min={1}
        max={99}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value || "1", 10))}
      />
      <button onClick={() => onChange(Math.min(99, value + 1))}>+</button>
    </div>
  );
}

export default function CartPage() {
  const { items, setQty, removeItem, clearCart, totals } = useCart();

  return (
    <div className="cart-page">
      <h1>
        Your Cart ({items.length} {items.length === 1 ? "item" : "items"})
      </h1>

      <div className="cart-layout">
        <div className="cart-items">
          <div className="cart-header">
            <div>Item</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total</div>
          </div>

          {items.length === 0 && (
            <div className="cart-empty">
              Your cart is empty. <Link to="/shop">Continue shopping →</Link>
            </div>
          )}

          {[...items]
            .sort((a, b) => {
              const titleA = a.listing?.title?.toLowerCase() || "";
              const titleB = b.listing?.title?.toLowerCase() || "";
              return titleA.localeCompare(titleB);
            })
            .map((it) => (
              <div className="cart-row" key={it.cart_item_id}>
                <div className="cart-item-cell">
                  <img
                    src={it.listing?.media?.[0]?.url || "/placeholder.png"}
                    alt={it.listing?.title || "Product image"}
                  />
                  <div className="cart-item-meta">
                    <div className="cart-item-title">{it.listing?.title}</div>
                    {it.listing?.artist && (
                      <div className="cart-item-sub">{it.listing.artist}</div>
                    )}
                    <button
                      className="link danger"
                      onClick={() => removeItem(it.cart_item_id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="cart-price">
                  ${fmt(it.listing?.price_cents || 0)}
                </div>
                <div className="cart-qty">
                  <QtyStepper
                    value={it.quantity}
                    onChange={(q) => setQty(it.cart_item_id, q)}
                  />
                </div>
                <div className="cart-line-total">
                  ${fmt((it.listing?.price_cents || 0) * it.quantity)}
                </div>
              </div>
            ))}
        </div>

        <aside className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <strong>${fmt(totals.subtotalCents)}</strong>
          </div>
          <div className="summary-row">
            <span>Sales Tax:</span>
            <strong>${fmt(totals.taxCents)}</strong>
          </div>
          <div className="summary-row total">
            <span>Grand total:</span>
            <strong>${fmt(totals.grandTotalCents)}</strong>
          </div>

          <button
            className="clear-btn"
            onClick={clearCart}
            disabled={items.length === 0}
          >
            Clear Cart
          </button>

          <button
            className="checkout-btn"
            onClick={() => alert("Checkout flow here!")}
            disabled={items.length === 0}
          >
            Check out
          </button>
        </aside>
      </div>
    </div>
  );
}
