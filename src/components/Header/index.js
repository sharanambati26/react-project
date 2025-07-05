import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useCart } from '../../CartContext';
import { useSearch } from '../../SearchContext';
import './Header.css';
import { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
    const { auth, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const { setSearchTerm } = useSearch();

    useEffect(() => {
        setCartCount(cart.length);
    }, [cart]);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setShowMenu(false);
    };

    const toggleMenu = () => {
        setShowMenu(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/">
                    <img src="/assets/company-logo.png" alt="Logo" className="navbar-logo" />
                </Link>
                <input
                    type="text"
                    placeholder="Search..."
                    className="navbar-search"
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);
                        setSearchTerm(value);
                    }}
                />
            </div>

            <div className="navbar-links">
                <Link to="/" className='home-nav-link'>Home</Link>
                <Link to="/cart" className="cart-link">
                    🛒 <span className="cart-count">{cartCount}</span>
                </Link>

                {!auth?.accessToken ? (
                    <Link to="/login">Login / Register</Link>
                ) : (
                    <div ref={menuRef} className="profile-wrapper">
                        <div className="profile-toggle" onClick={toggleMenu}>
                            <FaUserCircle size={24} />
                            <span className="profile-name">{auth.username}</span>
                        </div>
                        {showMenu && (
                            <div className="profile-dropdown">
                                <button className="profile-dropdown-item" onClick={handleLogout}>Logout</button>
                                <button className="profile-dropdown-item" onClick={() => {
                                    navigate('/settings');
                                    setShowMenu(false);
                                }}>Settings</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;
