import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cart, setCart } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (id, delta) => {
        setCart(prev => {
            return prev
                .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
                .filter(item => item.quantity > 0);
        });
    };

    const total = cart.reduce((sum, item) => sum + item.quantity * item.price * 85, 0);
    const gst = total * 0.18;
    const finalAmount = total + gst;

    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <img src="/assets/empty-cart.png" alt="Empty" className="empty-img" />
                <h2>Your Cart is Empty</h2>
                <Link to="/" className="home-btn">🛍️ Back to Shopping</Link>
            </div>
        );
    }

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="cart-page">
            <div className="cart-left">
                <h2 className="cart-title">🛒 Your Items</h2>
                {cart.map(item => (
                    <div className="cart-item" key={item.id}>
                        <img src={item.image} alt={item.title} className="item-thumb" />
                        <div className="item-info">
                            <h4 className="item-name">{item.title}</h4>
                            <p className="item-price">₹{Math.round(item.price * 85).toLocaleString()}</p>
                            <div className="qty-box">
                                <button className="qty-btn" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                <span className="qty-display">{item.quantity}</span>
                                <button className="qty-btn" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                            </div>
                            <p className="item-total">Total: ₹{Math.round(item.quantity * item.price * 85)}</p>
                        </div>
                    </div>
                ))}
                <h3 className="cart-subtotal">Subtotal: ₹{Math.round(total)}</h3>
            </div>

            <div className="cart-right">
                <div className="bill-box">
                    <h3 className="bill-title">🧾 Bill Summary</h3>
                    <div className="bill-row"><span>Subtotal:</span><span>₹{Math.round(total)}</span></div>
                    <div className="bill-row"><span>GST (18%):</span><span>₹{Math.round(gst)}</span></div>
                    <hr className="divider" />
                    <div className="bill-total">Total: ₹{Math.round(finalAmount)}</div>
                    <button className="checkout-btn" onClick={handleCheckout}>
                        Proceed to Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;