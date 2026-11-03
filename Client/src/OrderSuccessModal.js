import React from 'react';
import './OrderSuccessModal.css'; // Custom styles for the modal

// Modal component shown after successful order placement
function OrderSuccessModal({ orderId, onClose }) {
  return (
    <div className="overlay"> {/* Fullscreen semi-transparent background */}
      <div className="modal"> {/* Modal box centered on screen */}
        <img
          src="/images/logo.png" // Brand logo for visual confirmation
          alt="L&T Logo"
          className="logo-image"
        />
        <h2 className="title">Thank you for your purchase!</h2>

        <p className="text">
          Your order was placed successfully.<br />
          <strong>Order Number:</strong> {orderId} {/* Display order ID */}
        </p>

        <button onClick={onClose} className="button"> {/* Close modal & continue shopping */}
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccessModal;

