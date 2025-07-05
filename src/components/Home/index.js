import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';
import axios from '../../api';
import { useCart } from '../../CartContext';
import { useSearch } from '../../SearchContext';


const Home = () => {
    const [products, setProducts] = useState([]);
    const [sort, setSort] = useState('');
    const [filters, setFilters] = useState([]);
    const { cart, setCart } = useCart();
    const [visibleCount, setVisibleCount] = useState(4);
    const observerRef = useRef();
    const { searchTerm } = useSearch();
    const [search, setSearch] = useState('');
    const { setSearchTerm } = useSearch();
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('https://fakestoreapi.com/products');
                setProducts(res.data);
                console.log('Products fetched!')
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

    let filtered = products;
    if (filters.length > 0) {
        filtered = filtered.filter(p => filters.includes(p.category));
    }

    if (searchTerm.length >= 3) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

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

    const toggleMobileFilter = () => setShowMobileFilter(true);
    const closeMobileFilter = () => setShowMobileFilter(false);

    return (
        <div className="home-container">
            <div className="left-box">
                <div className="filter-section">
                    <h4>Sort By</h4>
                    <ul>
                        <li className={sort === 'low' ? 'active-sort' : ''} onClick={() => setSort('low')} > Price: Low to High </li>
                        <li className={sort === 'high' ? 'active-sort' : ''} onClick={() => setSort('high')} > Price: High to Low </li>
                        <li className={sort === 'rating' ? 'active-sort' : ''} onClick={() => setSort('rating')} > Rating </li>
                        <li className={sort === 'latest' ? 'active-sort' : ''} onClick={() => setSort('latest')} > Latest </li>
                        <li onClick={() => setSort('')} > Clear Sort </li>
                    </ul>

                    <h4>Filter By Category</h4>
                    <label><input className="filter-checkbox" type="checkbox" onChange={() => handleFilterChange('electronics')} checked={filters.includes('electronics')} /> Electronics</label>
                    <label><input className="filter-checkbox" type="checkbox" onChange={() => handleFilterChange('jewelery')} checked={filters.includes('jewelery')} /> Jewelry</label>
                    <label><input className="filter-checkbox" type="checkbox" onChange={() => handleFilterChange("men's clothing")} checked={filters.includes("men's clothing")} /> Men's Clothing</label>
                    <label><input className="filter-checkbox" type="checkbox" onChange={() => handleFilterChange("women's clothing")} checked={filters.includes("women's clothing")} /> Women's Clothing</label>
                </div>
            </div>
            <div className='filter-mob-div'>
                <input type="text" placeholder="Search..." className="home-search" value={search}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);
                        setSearchTerm(value);
                    }}
                />
                <div>
                    <div className='filter-header-mob'>
                        <button className='filter-button-mob' onClick={toggleMobileFilter}>Filters</button>
                        {filters.length > 0 && (
                            <div className='applied-filters'>
                                {filters.map(f => (
                                    <span key={f} className="applied-filter-badge">{f}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    {showMobileFilter && (
                        <div className='filter-bg'>
                            <div className="filter-mob">
                                <h4>Sort By</h4>
                                <ul>
                                    <li className={sort === 'low' ? 'active-sort' : ''} onClick={() => setSort('low')} > Price: Low to High </li>
                                    <li className={sort === 'high' ? 'active-sort' : ''} onClick={() => setSort('high')} > Price: High to Low </li>
                                    <li className={sort === 'rating' ? 'active-sort' : ''} onClick={() => setSort('rating')} > Rating </li>
                                    <li className={sort === 'latest' ? 'active-sort' : ''} onClick={() => setSort('latest')} > Latest </li>
                                    <li onClick={() => setSort('')} > Clear Sort </li>
                                </ul>

                                <h4>Filter By Category</h4>
                                <label><input className="filter-checkbox" type="checkbox" onChange={() => handleFilterChange('electronics')} checked={filters.includes('electronics')} /> Electronics</label>
                                <label><input className="filter-checkbox" type="checkbox" onChange={() => handleFilterChange('jewelery')} checked={filters.includes('jewelery')} /> Jewelry</label>
                                <label><input className="filter-checkbox" type="checkbox" onChange={() => handleFilterChange("men's clothing")} checked={filters.includes("men's clothing")} /> Men's Clothing</label>
                                <label><input className="filter-checkbox" type="checkbox" onChange={() => handleFilterChange("women's clothing")} checked={filters.includes("women's clothing")} /> Women's Clothing</label>
                            </div>
                            <button className="filter-close-button" onClick={closeMobileFilter}>Apply</button>
                        </div>
                    )

                    }
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
