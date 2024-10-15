import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a CartContext
const CartContext = createContext();

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart from localStorage when the component mounts
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
        localStorage.removeItem('cart'); // Clear invalid data
      }
    }
  }, []);

  const addToCart = (product, variant) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id && item.variant === variant);
      const updatedCart = existingItem
        ? prevCart.map(item =>
            item.product.id === product.id && item.variant === variant
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prevCart, { product, variant, quantity: 1 }];

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (productId, variant) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => !(item.product.id === productId && item.variant === variant));

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateQuantity = (productId, variant, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
    } else {
      setCart(prevCart => {
        const updatedCart = prevCart.map(item =>
          item.product.id === productId && item.variant === variant
            ? { ...item, quantity }
            : item
        );

        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return updatedCart;
      });
    }
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0); // Calculate total items in the cart
  const clearCart = () => {
    setCart([]);
    // Clear the cart in localStorage
    localStorage.removeItem('cart');
  };
  

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use the CartContext
export const useCart = () => {
  return useContext(CartContext);
};
