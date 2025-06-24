import { createContext, useContext, useState } from 'react';
import { useCart } from './CartContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : { accessToken: null, refreshToken: null, username: null };
  });

  const { setCart } = useCart();

  const login = (accessToken, refreshToken, username) => {
    const newAuth = { accessToken, refreshToken, username };
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth({ accessToken: null, refreshToken: null, username: null });
    localStorage.removeItem('auth');
    setCart([]);
    localStorage.removeItem('cart'); 
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
