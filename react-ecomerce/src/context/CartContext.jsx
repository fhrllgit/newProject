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

const addToCart = (product, sizeObj) => {
  console.log("sizeObj yang dikirim:", sizeObj);
  const existing = cart.find(
    (item) => item.id === product.id && item.size?.value === sizeObj.value
  );

  if (existing) {
    setCart(
      cart.map((item) =>
        item.id === product.id && item.size?.value === sizeObj.value
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  } else {
    setCart([...cart, { ...product, size: sizeObj, qty: 1 }]);
  }
};


const removeFromCart = (id, sizeObj) => {
  setCart(cart.filter(
    item => !(item.id === id && item.size.value === sizeObj.value)
  ));
};

const updateQuantity = (id, sizeObj, qty) => {
  setCart(cart.map(item => 
    item.id === id && item.size.value === sizeObj.value
      ? { ...item, qty: Number(qty) }
      : item
  ));
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
