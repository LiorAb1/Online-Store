import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useLocation, useNavigate, Link } from 'react-router-dom'; 
import './Navbar.css';

function Navbar({
  onHomeClick,
  onAboutClick,
  onProductsClick,
  onCartClick,
  itemCount,
  totalPrice,
  cartRef
}) {
  const location = useLocation(); // React Router hook to get current URL path
  const navigate = useNavigate(); // React Router hook for programmatic navigation
  const isHomePage = location.pathname === '/'; // Check if user is on homepage

  // Handle navigation and scrolling based on current page
  const handleNavClick = (sectionFn, fallbackPath = '/') => {
    if (isHomePage) {
      sectionFn(); // If on homepage, scroll to section
    } else {
      navigate(fallbackPath); // Otherwise, navigate to homepage or fallback path
    }
  };

  return (
    <>
      {/* Show top promotion bar only on homepage */}
      {isHomePage && (
        <div className="top-bar">
          <span className="top-bar-text">
            Free shipping with coupon code <strong>LTFREE</strong>
          </span>
        </div>
      )}

      <nav className="navbar">
        <div className="navbar-left">
          {/* Use Link instead of anchor to enable SPA navigation without reload */}
          <Link to="/" className="navbar-logo"> 
            <img
              src="/images/logo.png"
              alt="L&T Logo"
            />
          </Link>
        </div>

        <div className="navbar-center">
          {/* Buttons trigger smooth scroll or navigation */}
          <button className="nav-button" onClick={() => handleNavClick(onHomeClick)}>Home</button>
          <button className="nav-button" onClick={() => handleNavClick(onAboutClick)}>About</button>
          <button className="nav-button" onClick={() => handleNavClick(onProductsClick)}>Products</button>
        </div>

        {/* Cart icon area with conditional pointer and opacity for usability */}
        <div
          className="navbar-right"
          onClick={isHomePage ? onCartClick : undefined} // Only clickable on homepage
          style={{
            cursor: isHomePage ? 'pointer' : 'not-allowed', // Visual cue for disabled state
            opacity: isHomePage ? 1 : 0.5, // Dim when disabled
          }}
        >
          <div className="cart-icon-wrapper">
            <FaShoppingCart size={30} className="cart-icon" ref={cartRef} /> {/* Cart icon with ref for animation */}
            <span className="cart-info-text">
              <span>{itemCount}</span> {' | '}<span>${totalPrice.toFixed(2)}</span> {/* Show item count and total price */}
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;



