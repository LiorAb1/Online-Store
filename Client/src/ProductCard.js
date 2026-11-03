import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, imgRef }) => {
  // State to toggle product description visibility on mobile devices
  const [showDescription, setShowDescription] = useState(false);
  // State to track if viewport width is mobile size (<= 768px)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Update isMobile based on window width on initial render and resize events
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize); // Listen for window resize
    return () => window.removeEventListener('resize', handleResize); // Cleanup listener on unmount
  }, []);

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {/* Image ref used for animations like fly-to-cart */}
        <img
          ref={imgRef}
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </div>

      <h1 className="product-name">{product.name}</h1>

      {/* On mobile, allow toggling the description visibility */}
      {isMobile && (
        <span
          className="toggle-description-btn"
          onClick={() => setShowDescription(!showDescription)}
        >
          {showDescription ? 'Hide Description' : 'View Description'}
        </span>
      )}

      {/* Show description by default on desktop, or based on toggle on mobile */}
      {(isMobile ? showDescription : true) && (
        <p className="product-description-full">{product.description}</p>
      )}

      <div className="product-actions">
        <p className="product-price">${product.price.toFixed(2)}</p>
        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
        >
          <FaShoppingCart style={{ marginRight: '8px' }} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;


