// src/context/CartContext.jsx
import React, { useState, useEffect, createContext } from 'react';
import { LOCAL_STORAGE_CART_KEY } from '../utils/constants';
import  {generateCartKey} from '../utils/helpers';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (newItem) => {
    const itemKey = generateCartKey(newItem.product_id, newItem.selectedAttributes);

    const existingIndex = cartItems.findIndex(
      (item) => generateCartKey(item.product_id, item.selectedAttributes) === itemKey
    );

    if (existingIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += newItem.quantity;
      setCartItems(updatedCart);
    } else {
      setCartItems(prev => [...prev, { ...newItem }]);
    }
  };

  const increaseQty = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
  };

  const decreaseQty = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    } else {
      updatedCart.splice(index, 1);
    }
    setCartItems(updatedCart);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      increaseQty,
      decreaseQty,
      isCartOpen,
      setCartOpen,
      selectedProduct,
      setCartItems,
      setSelectedProduct
    }}>
      {children}
    </CartContext.Provider>
  );
};
