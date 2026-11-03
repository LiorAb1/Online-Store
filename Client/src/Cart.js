import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart({ cartItems, onClose, onRemove, onQuantityChange }) {
  // Calculate total price of all items in the cart
  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;      // Convert price to number safely
    const quantity = Number(item.quantity) || 0; // Convert quantity to number safely
    return sum + price * quantity;               // Accumulate total cost
  }, 0);

  return (
    <div className="cart-container">
      {/* Cart title header */}
      <h3 className="cart-title">Your Cart</h3>

      {/* Button to close the cart */}
      <button onClick={onClose} className="cart-close-btn" aria-label="Close cart">×</button>

      {/* Show message if cart is empty */}
      {cartItems.length === 0 ? (
        <p className="cart-empty-message">Your cart is empty.</p>
      ) : (
        <>
          {/* Render each item in the cart */}
          {cartItems.map((item, index) => (
            <React.Fragment key={item._id}>
              <div className="cart-item">
                {/* Product image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  {/* Product name */}
                  <div className="cart-item-name">{item.name}</div>

                  {/* Quantity controls with decrease, input and increase buttons */}
                  <div className="cart-item-quantity-wrapper">
                    <span className="cart-item-quantity-label">Quantity:</span>

                    {/* Decrease quantity button, disabled if quantity <= 1 */}
                    <button
                      className="quantity-btn"
                      onClick={() => onQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    {/* Quantity input field with validation */}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1) {
                          onQuantityChange(item._id, val);
                        }
                      }}
                      className="cart-item-quantity-input"
                      aria-label={`Quantity for ${item.name}`}
                    />

                    {/* Increase quantity button */}
                    <button
                      className="quantity-btn"
                      onClick={() => onQuantityChange(item._id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Price and total cost for the individual product */}
                  <div className="cart-item-price">
                    Price: ${Number(item.price).toFixed(2)}<br />
                    <strong>Total: ${(Number(item.price) * Number(item.quantity) || 0).toFixed(2)}</strong>
                  </div>
                </div>

                {/* Button to remove the item from the cart */}
                <button
                  onClick={() => onRemove(item._id)}
                  className="cart-remove-btn"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  🗑️
                </button>
              </div>

              {/* Divider line between cart items except after last item */}
              {index !== cartItems.length - 1 && (
                <hr className="cart-divider" />
              )}
            </React.Fragment>
          ))}

          {/* Total price summary */}
          <hr />
          <p className="cart-total">
            Total: ${total.toFixed(2)}
          </p>

          {/* Checkout button that links to order page */}
          <Link to="/order" className="checkout-link">
            <button className="checkout-button">
              Checkout
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;
