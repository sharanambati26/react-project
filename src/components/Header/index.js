// src/components/Header/Header.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useCart } from '../../CartContext';
import './Header.css';
import { useState, useEffect } from 'react';

const Header = () => {
  const { auth, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const count = cart.length; // Count of distinct items
    setCartCount(count);
  }, [cart]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/assets/company-logo.png" alt="Logo" className="navbar-logo" />
        <input
          type="text"
          placeholder="Search..."
          className="navbar-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/cart" className="cart-link">
          🛒 <span className="cart-count">{cartCount}</span>
        </Link>
        {!auth?.accessToken ? (
          <Link to="/login">Login / Register</Link>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Header;
