import React, { useState } from 'react';
import './Checkout.css';
import { useAuth } from '../../AuthContext';
import { useCart } from '../../CartContext';
import axios from 'axios';

const Checkout = () => {
	const { auth } = useAuth();
	const { cart } = useCart();

	const [form, setForm] = useState({
		name: '',
		address: '',
		city: '',
		pincode: '',
		paymentMethod: 'cod',
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const calculateTotal = () => {
		return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!auth?.userid || cart.length === 0 || calculateTotal() === 0) {
			alert('Missing fields: ensure you are logged in and have items in your cart.');
			return;
		}

		try {
			const response = await axios.post('https://ecom-server-4war.onrender.com/api/order', {
				userId: auth.userid,
				items: cart,
				total: calculateTotal(),
				shipping: {
					name: form.name,
					address: form.address,
					city: form.city,
					pincode: form.pincode,
				},
				paymentMethod: form.paymentMethod,
				email: 'sharan_1122@yopmail.com'
			});

			alert(`Order placed successfully! Your Order ID: ${response.data.orderId}`);
			// TODO: clear cart logic
		} catch (err) {
			console.error(err);
			alert('Failed to place order. Please try again.');
		}
	};

	return (
		<div className="checkout-container">
			<h2>Checkout</h2>
			<div className="checkout-summary">
				<h4>Order Summary</h4>
				{cart.length === 0 ? (
					<p>No items in cart</p>
				) : (
					<ul>
						{cart.map((item, index) => (
							<li key={index}>
								{item.name} x {item.quantity} = ₹{item.price * item.quantity}
							</li>
						))}
					</ul>
				)}
				<p><strong>Total:</strong> ₹{calculateTotal()}</p>
			</div>
			<div className="checkout-content">
				<label>Delivery Address</label>
				<form onSubmit={handleSubmit} className="checkout-form">
					<input name="name" placeholder="Full Name" required onChange={handleChange} />
					<textarea name="address" placeholder="Address" required onChange={handleChange}></textarea>
					<input name="city" placeholder="City" required onChange={handleChange} />
					<input name="pincode" placeholder="Pincode" required onChange={handleChange} />

					<h4>Payment Method</h4>
					<label>
						<input
							type="radio"
							name="paymentMethod"
							value="cod"
							checked={form.paymentMethod === 'cod'}
							onChange={handleChange}
						/> Cash on Delivery
					</label>
					<label>
						<input
							type="radio"
							name="paymentMethod"
							value="upi"
							onChange={handleChange}
						/> UPI
					</label>
					<label>
						<input
							type="radio"
							name="paymentMethod"
							value="card"
							onChange={handleChange}
						/> Credit/Debit Card
					</label>
					<button type="submit" className="pay-button">Place Order</button>
				</form>
			</div>
		</div>
	);
};

export default Checkout;
