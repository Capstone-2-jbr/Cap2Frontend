import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import { API_URL } from "../shared";

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return action.payload;
    default:
      return state;
  }
}

export function CartProvider({ children, user }) {
  const [state, dispatch] = React.useReducer(reducer, { items: [] });

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      dispatch({ type: "LOAD", payload: { items: [] } });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cart`,
         {
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        withCredentials: true,
      });
      dispatch({ type: "LOAD", payload: res.data || { items: [] } });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      dispatch({ type: "LOAD", payload: { items: [] } });
    }
  };

  const addItem = async (listing_id, quantity = 1) => {
    try {
      await axios.post(
        `${API_URL}/api/cart/add`,
        { listing_id, quantity },
        { withCredentials: true }
      );
      await fetchCart();
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const setQty = async (cart_item_id, quantity) => {
    try {
      await axios.put(
        `${API_URL}/api/cart/item/${cart_item_id}`,
        { quantity },
        { withCredentials: true }
      );
      await fetchCart();
    } catch (err) {
      console.error("Failed to update cart item:", err);
    }
  };

  const removeItem = async (cart_item_id) => {
    try {
      await axios.delete(`${API_URL}/api/cart/item/${cart_item_id}`, {
        withCredentials: true,
      });
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };
  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/api/cart/clear`, {
        withCredentials: true,
      });
      await fetchCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const totals = useMemo(() => {
    const subtotalCents = state.items.reduce(
      (s, it) => s + (it.listing?.price_cents || 0) * (it.quantity || 1),
      0
    );
    const taxCents = Math.round(subtotalCents * 0.1);
    const grandTotalCents = subtotalCents + taxCents;
    return { subtotalCents, taxCents, grandTotalCents };
  }, [state.items]);

  const api = {
    items: state.items || [],
    fetchCart,
    addItem,
    removeItem,
    setQty,
    clearCart,
    totals,
  };

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
