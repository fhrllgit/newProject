import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  const addToCart = (product, size) => {
    const existing = cart.find(
      (item) => item.id === product.id && item.size === size
    );
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, size, qty: 1 }]);
    }
  };
  const removeFromCart = (id, size) => {
    setCart(cart.filter((item) => !(item.id === id && item.size === size)));
  };
const updateQuantity = (id, size, qty) => {
  setCart(
    cart.map((item) =>
      item.id === id && item.size === size
        ? { ...item, qty: Number(qty) }
        : item
    )
  );
};

  const clearCart = () => {
    setCart([]);
  };
  const totalItems = cart.reduce((acc, cur) => acc + cur.qty, 0);
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalItems, updateQuantity, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
