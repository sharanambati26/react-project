import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import axios from '../../api';
import { useCart } from '../../CartContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('');
  const [filters, setFilters] = useState([]);
  const { cart, setCart } = useCart();
  const [visibleCount, setVisibleCount] = useState(4);
  const observerRef = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://fakestoreapi.com/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + 4);
      }
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [products]);

  const handleAddToCart = (item) => {
    const exists = cart.find(p => p.id === item.id);
    if (exists) {
      setCart(cart.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleIncrease = (itemId) => {
    setCart(cart.map(p => p.id === itemId ? { ...p, quantity: p.quantity + 1 } : p));
  };

  const handleDecrease = (itemId) => {
    setCart(cart => {
      return cart
        .map(p => p.id === itemId ? { ...p, quantity: p.quantity - 1 } : p)
        .filter(p => p.quantity > 0);
    });
  };

  const getItemQuantity = (id) => {
    const found = cart.find(p => p.id === id);
    return found ? found.quantity : 0;
  };

  const handleFilterChange = (type) => {
    if (filters.includes(type)) {
      setFilters(filters.filter((f) => f !== type));
    } else {
      setFilters([...filters, type]);
    }
  };

  const filtered = filters.length > 0
    ? products.filter((p) => filters.includes(p.category))
    : products;

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'low': return a.price - b.price;
      case 'high': return b.price - a.price;
      case 'rating': return b.rating.rate - a.rating.rate;
      case 'latest': return b.id - a.id;
      default: return 0;
    }
  });

  const visibleProducts = sorted.slice(0, visibleCount);

  return (
    <div className="home-container">
      <div className="left-box">
        <div className="filter-section">
          <h4>Sort By</h4>
          <ul>
            <li onClick={() => setSort('low')}>Price: Low to High</li>
            <li onClick={() => setSort('high')}>Price: High to Low</li>
            <li onClick={() => setSort('rating')}>Rating</li>
            <li onClick={() => setSort('latest')}>Latest</li>
            <li onClick={() => setSort('')}>Reset Sort</li>
          </ul>

          <h4>Filter By Category</h4>
          <label><input type="checkbox" onChange={() => handleFilterChange('electronics')} checked={filters.includes('electronics')} /> Electronics</label><br/>
          <label><input type="checkbox" onChange={() => handleFilterChange('jewelery')} checked={filters.includes('jewelery')} /> Jewelry</label><br/>
          <label><input type="checkbox" onChange={() => handleFilterChange("men's clothing")} checked={filters.includes("men's clothing")} /> Men's Clothing</label><br/>
          <label><input type="checkbox" onChange={() => handleFilterChange("women's clothing")} checked={filters.includes("women's clothing")} /> Women's Clothing</label><br/>
        </div>
      </div>

      <div className="right-box">
        {visibleProducts.map((item) => {
          const qty = getItemQuantity(item.id);
          return (
            <div key={item.id} className="item-card">
              <img src={item.image} alt={item.title} className="item-image" />
              <h4>{item.title}</h4>
              <p>₹{Math.round(item.price * 85).toLocaleString()}</p>
              <p>⭐ {item.rating.rate} ({item.rating.count})</p>
              {qty === 0 ? (
                <button className="add-button" onClick={() => handleAddToCart(item)}>
                  🛒 Add to Cart
                </button>
              ) : (
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => handleDecrease(item.id)}>-</button>
                  <span className="qty-display">{qty}</span>
                  <button className="qty-btn" onClick={() => handleIncrease(item.id)}>+</button>
                </div>
              )}
            </div>
          );
        })}
        <div ref={observerRef}></div>
      </div>
    </div>
  );
};

export default Home;
