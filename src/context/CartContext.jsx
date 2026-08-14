import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('activehands_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    const cleaned = String(priceStr).replace(/[^\d.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // Sync cart from backend when authenticated
  const fetchBackendCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const saved = localStorage.getItem('activehands_cart');
      const localItems = saved ? JSON.parse(saved) : [];
      if (localItems.length > 0) {
        const synced = await api.syncCart(localItems);
        if (synced && Array.isArray(synced)) {
          const formatted = synced.map((item) => ({
            id: item.product_id || item.id,
            title: item.title,
            price: item.price,
            numericPrice: item.numeric_price || parsePrice(item.price),
            img: item.img,
            url: item.url,
            quantity: item.quantity,
          }));
          setCart(formatted);
          return;
        }
      }

      const data = await api.getCart();
      if (data && Array.isArray(data)) {
        const formatted = data.map((item) => ({
          id: item.product_id || item.id,
          title: item.title,
          price: item.price,
          numericPrice: item.numeric_price || parsePrice(item.price),
          img: item.img,
          url: item.url,
          quantity: item.quantity,
        }));
        setCart(formatted);
      }
    } catch (err) {
      console.warn('Failed to load cart from database:', err);
    }
  }, [isAuthenticated]);

  // When user logs in fetch their cart, when logged out reset cart completely
  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendCart();
    } else {
      setCart([]);
      try {
        localStorage.removeItem('activehands_cart');
      } catch (e) {
        console.error(e);
      }
    }
  }, [isAuthenticated, fetchBackendCart]);

  // Persist to localStorage only when items exist
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem('activehands_cart', JSON.stringify(cart));
      } else {
        localStorage.removeItem('activehands_cart');
      }
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = async (product, quantity = 1) => {
    const numericPrice = parsePrice(product.price);
    const itemData = {
      id: product.id,
      title: product.title,
      price: product.price,
      numericPrice: numericPrice,
      img: product.img,
      url: product.url,
      quantity: quantity,
    };

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevCart, itemData];
      }
    });

    setLastAddedItem(product);
    setIsCartOpen(true);

    if (isAuthenticated) {
      try {
        await api.addToCart(product, quantity);
      } catch (err) {
        console.error('Error adding to remote database cart:', err);
      }
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );

    if (isAuthenticated) {
      try {
        await api.updateCartItem(productId, newQty);
      } catch (err) {
        console.error('Error updating cart in database:', err);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

    if (isAuthenticated) {
      try {
        await api.removeCartItem(productId);
      } catch (err) {
        console.error('Error removing item from database:', err);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    try {
      localStorage.removeItem('activehands_cart');
    } catch {}
    if (isAuthenticated) {
      try {
        await api.clearCart();
      } catch (err) {
        console.error('Error clearing database cart:', err);
      }
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.numericPrice || parsePrice(item.price)) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        lastAddedItem,
        setLastAddedItem,
        refreshCart: fetchBackendCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
