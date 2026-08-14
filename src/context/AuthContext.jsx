import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('activehands_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('activehands_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('activehands_user');
      }
    } catch (e) {
      console.error('Failed to update user in localStorage', e);
    }
  }, [user]);

  const login = (email, password) => {
    // Basic validation / mock login
    const name = email.split('@')[0];
    const loggedUser = {
      id: 'user_' + Date.now(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      joinedDate: 'August 2026',
      points: 120,
      tier: 'Master Crafter ⭐',
      avatar: '/assets/4.png',
      orders: [
        {
          id: 'AH-84920',
          date: '10 Aug 2026',
          items: ['Mosaic Art Tray Kit'],
          total: '₹899.00',
          status: 'Delivered',
        },
        {
          id: 'AH-71829',
          date: '02 Aug 2026',
          items: ['Book Binding DIY Kit', 'Weaving Loom DIY Kit'],
          total: '₹1,698.00',
          status: 'In Transit 🚚',
        },
      ],
      savedAddresses: [
        {
          id: 'addr_1',
          name: name.charAt(0).toUpperCase() + name.slice(1),
          address: '42, Craft Lane, Green Park',
          city: 'Bengaluru',
          pincode: '560034',
          phone: '+91 98765 43210',
          isDefault: true,
        },
      ],
    };
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const signup = (name, email, password) => {
    const newUser = {
      id: 'user_' + Date.now(),
      name: name,
      email: email,
      joinedDate: 'August 2026',
      points: 50,
      tier: 'Junior Maker 🌱',
      avatar: '/assets/9.png',
      orders: [],
      savedAddresses: [],
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginAsDemo = () => {
    login('artlover@activehands.com', 'password123');
  };

  const logout = () => {
    setUser(null);
    setIsAccountOpen(false);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuth = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuth,
        closeAuth,
        isAccountOpen,
        openAccount: () => setIsAccountOpen(true),
        closeAccount: () => setIsAccountOpen(false),
        login,
        signup,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
