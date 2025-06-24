import React, { useState } from 'react';
import './Checkout.css';

const Checkout = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed with ${form.paymentMethod.toUpperCase()}!`);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <input name="name" placeholder="Full Name" required onChange={handleChange} />
        <textarea name="address" placeholder="Address" required onChange={handleChange}></textarea>
        <input name="city" placeholder="City" required onChange={handleChange} />
        <input name="pincode" placeholder="Pincode" required onChange={handleChange} />

        <h4>Payment Method</h4>
        <label><input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === 'cod'} onChange={handleChange} /> Cash on Delivery</label>
        <label><input type="radio" name="paymentMethod" value="upi" onChange={handleChange} /> UPI</label>
        <label><input type="radio" name="paymentMethod" value="card" onChange={handleChange} /> Credit/Debit Card</label>

        <button type="submit" className="pay-button">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
