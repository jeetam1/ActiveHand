import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('activehands_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Fetch wishlist from Supabase PostgreSQL database
  const fetchBackendWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.getWishlist();
      if (data && Array.isArray(data)) {
        const formatted = data.map((item) => ({
          id: item.product_id,
          title: item.title,
          price: item.price,
          img: item.img,
          category: item.category,
        }));
        setWishlist(formatted);
      }
    } catch (err) {
      console.warn('Failed to load wishlist from database:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendWishlist();
    }
  }, [isAuthenticated, fetchBackendWishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('activehands_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to update wishlist in localStorage', e);
    }
  }, [wishlist]);

  const toggleWishlist = async (product) => {
    const exists = wishlist.some((item) => item.id === product.id);

    // Optimistic UI update
    setWishlist((prev) => {
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });

    if (isAuthenticated) {
      try {
        await api.toggleWishlist(product);
      } catch (err) {
        console.error('Error toggling wishlist in database:', err);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const removeFromWishlist = async (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    if (isAuthenticated) {
      try {
        await api.toggleWishlist({ id: productId });
      } catch (err) {
        console.error('Error removing from wishlist in database:', err);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        totalWishlist: wishlist.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        isWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        refreshWishlist: fetchBackendWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
