import React, { useState } from 'react';
import axios from 'axios';
import OrderSuccessModal from './OrderSuccessModal';
import './OrderPage.css'; 

function OrderPage({ cartItems, clearCart }) {
  // State for form inputs
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    shipping: 'pickup'
  });

  // Coupon related states
  const [couponCode, setCouponCode] = useState('');
  const [couponValid, setCouponValid] = useState(null);
  const [freeShipping, setFreeShipping] = useState(false);

  // Error and success message states
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Order info states
  const [finalTotal, setFinalTotal] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  // Calculate shipping cost (free if coupon applied)
  const SHIPPING_COST = form.shipping === 'home' && !freeShipping ? 20 : 0;

  // Calculate total price efficiently — consider using useMemo if cartItems is large or updated frequently
  const calculatedTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) + SHIPPING_COST;

  // Handle form input changes and reset messages
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  // Change shipping method
  const handleShippingChange = (method) => {
    setForm(prev => ({ ...prev, shipping: method }));
  };

  // Basic email validation regex
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Coupon validation logic
  const validateCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'LTFREE') {
      setCouponValid(true);
      setFreeShipping(true);
    } else {
      setCouponValid(false);
      setFreeShipping(false);
    }
  };

  // Form submission handler with validation and API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.name) newErrors.name = 'Required';
    else if (!/^[A-Za-z\s]+$/.test(form.name)) newErrors.name = 'Letters only';

    if (!form.email) newErrors.email = 'Required';
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email';

    if (!form.phone) newErrors.phone = 'Required';
    else if (!/^\d{7,}$/.test(form.phone)) newErrors.phone = 'Invalid number';

    if (!form.address) newErrors.address = 'Required';
    else {
      const addressRegex = /^([\w\sא-ת]+)\s+(\d{1,5})/;
      if (!addressRegex.test(form.address.trim())) {
        newErrors.address = 'Enter a valid address with street and number';
      }
    }

    // If errors, update state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setError('Please fix the highlighted fields');
      return;
    }

    setFieldErrors({});

    try {
      // Submit order to backend
      const res = await axios.post('http://localhost:5000/orders', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        shipping: form.shipping,
        items: cartItems,
        total: calculatedTotal
      });

      // Update UI with success info
      setFinalTotal(calculatedTotal);
      setOrderId(res.data.orderId);
      setSuccess(`Order placed successfully! Your Order Number is: ${res.data.orderId}`);
      setShowBanner(true);

      // Clear cart shortly after success
      setTimeout(() => clearCart(), 500);

      // Reset coupon inputs
      setCouponCode('');
      setCouponValid(null);
      setFreeShipping(false);
    } catch (err) {
      console.error('Error sending order:', err);
      setError('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="order-container">
      <h2 className="order-title">Order Summary</h2>

      <div className="order-items">
        {cartItems.map(item => (
          <div key={item._id} className="order-item">
            <img src={item.image} alt={item.name} className="order-item-image" />
            <div className="order-item-info">
              <strong>{item.name}</strong><br />
              Quantity: {item.quantity}<br />
              Unit Price: ${item.price.toFixed(2)}<br />
              Total: ${(item.quantity * item.price).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="shipping-section">
        <h2 className="shipping-title">Shipping Method</h2>
        <div className="shipping-options">
          <button
            type="button"
            onClick={() => handleShippingChange('pickup')}
            className={`shipping-option-btn ${form.shipping === 'pickup' ? 'selected' : ''}`}
          >
            Pickup<br /><small>(Free-up to 14 days)</small>
          </button>
          <button
            type="button"
            onClick={() => handleShippingChange('home')}
            className={`shipping-option-btn ${form.shipping === 'home' ? 'selected' : ''}`}
          >
            Home Delivery<br /><small>(+$20 up to 3 days)</small>
          </button>
        </div>
      </div>

      <div className="coupon-section">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="coupon-input"
          />
          <button
            type="button"
            onClick={validateCoupon}
            className="coupon-check-btn"
            disabled={!couponCode.trim()} // Disable button if input empty
          >
            Check
          </button>
        </div>
        {couponValid === true && <p style={{ color: 'green', marginTop: '0.5rem' }}>Coupon applied! You get free shipping.</p>}
        {couponValid === false && <p style={{ color: 'red', marginTop: '0.5rem' }}>Invalid coupon code.</p>}
      </div>

      <div className="form-section">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className={`form-input ${fieldErrors.name ? 'input-error' : ''}`}
        />
        {fieldErrors.name && <p className="error-text">{fieldErrors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
        />
        {fieldErrors.email && <p className="error-text">{fieldErrors.email}</p>}

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className={`form-input ${fieldErrors.phone ? 'input-error' : ''}`}
        />
        {fieldErrors.phone && <p className="error-text">{fieldErrors.phone}</p>}

        <input
          type="text"
          name="address"
          placeholder="Shipping Address"
          value={form.address}
          onChange={handleChange}
          className={`form-input ${fieldErrors.address ? 'input-error' : ''}`}
        />
        {fieldErrors.address && <p className="error-text">{fieldErrors.address}</p>}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="total-section">
        <p className="total-text">
          Total: ${finalTotal !== null ? finalTotal.toFixed(2) : calculatedTotal.toFixed(2)}
        </p>
      </div>

      <button
        onClick={handleSubmit}
        className="place-order-btn"
      >
        Place Order
      </button>

      {showBanner && (
        <OrderSuccessModal
          orderId={orderId}
          onClose={() => {
            setShowBanner(false);
            window.location.replace('/'); // Redirect to home after order success modal closes
          }}
        />
      )}
    </div>
  );
}

export default OrderPage;






