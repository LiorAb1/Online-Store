import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from './api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Cart from './Cart';
import OrderPage from './OrderPage';
import ProductCard from './ProductCard';
import './App.css';

function App() {
  // State to store products fetched from server
  const [products, setProducts] = useState([]);
  // Cart items state, initialized from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  // State to control cart visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Loading and error states for fetching products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for scrolling to different sections and cart icon
  const productsRef = useRef(null);
  const aboutRef = useRef(null);
  const cartRef = useRef(null);
  const cartIconRef = useRef(null);

  // Smooth scroll to top of page
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  // Smooth scroll to products section
  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  // Smooth scroll to about section
  const scrollToAbout = () => aboutRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Fetch products data from backend API on component mount
  useEffect(() => {
    axios.get(`${API_URL}/products`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error');
        setLoading(false);
      });
  }, []);

  // Persist cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Close cart if user clicks outside the cart area
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isCartOpen && cartRef.current && !cartRef.current.contains(e.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen]);

  // Animate product image flying to cart icon
  const animateToCart = (imgElement) => {
    if (!imgElement || !cartIconRef.current) return;

    const imgRect = imgElement.getBoundingClientRect();
    const cartRect = cartIconRef.current.getBoundingClientRect();

    const clone = imgElement.cloneNode();
    clone.style.position = 'fixed';
    clone.style.left = `${imgRect.left}px`;
    clone.style.top = `${imgRect.top}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.transition = 'all 1s ease-in-out';
    clone.style.zIndex = 1000;

    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.left = `${cartRect.left}px`;
      clone.style.top = `${cartRect.top}px`;
      clone.style.opacity = '0.2';
      clone.style.transform = 'scale(0.1)';  // Animate scale down 
    });

    setTimeout(() => {
      document.body.removeChild(clone);
    }, 1000);
  };

  // Add product to cart or increment quantity if already in cart
  const addToCart = (product, imgRef) => {
    setCartItems((prev) => {
      const found = prev.find((item) => item._id === product._id);
      if (found) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    setIsCartOpen(true); // Automatically open cart on adding
    if (imgRef && imgRef.current) {
      animateToCart(imgRef.current); // Run animation
    }
  };

  // Remove product from cart by id
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // Update quantity of a product in cart, with minimum of 1
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return; // Prevent invalid quantities
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  // Calculate total item count in cart
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  // Calculate total price of items in cart
  const cartTotalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <Router>
      <Navbar
        onHomeClick={scrollToTop}
        onCartClick={() => setIsCartOpen(true)}
        onProductsClick={scrollToProducts}
        onAboutClick={scrollToAbout}
        itemCount={cartItemCount}
        totalPrice={cartTotalPrice}
        cartRef={cartIconRef} // Pass ref for animation target
      />

      {isCartOpen && (
        <div ref={cartRef}>
          <Cart
            cartItems={cartItems}
            onClose={() => setIsCartOpen(false)}
            onRemove={removeFromCart}
            onQuantityChange={updateQuantity}
          />
        </div>
      )}

      <Routes>
        <Route path="/" element={
          <>
            {/* Homepage image */}
            <img
              src="/images/homet.png"
              alt="Home"
              className="home-image"
            />

            {/* About Us Section */}
            <div ref={aboutRef} className="about-section">
              <h2>About Us</h2>
              <p><strong>L&T – Luxurious Cosmetics</strong> is a boutique skincare brand that blends elegance with scientific integrity.</p>
              <p>Our formulas are crafted with dermatologically approved ingredients, enriched with botanical extracts, antioxidants, and skin-replenishing vitamins.</p>
              <p style={{ fontStyle: 'italic' }}>L&T – Where science meets softness. Where care becomes culture.</p>
            </div>

            {/* Products Section */}
            <div ref={productsRef}>
              <h2 className="products-title">Our Products</h2>
              {loading ? (
                <p className="loading-text">Loading</p> // Loading indicator during fetch
              ) : error ? (
                <p className="error-text">Error</p> // Error message if fetch fails
              ) : (
                <div className="product-grid">
                  {products.map((product) => {
                    const imgRef = React.createRef(); // Create ref for product image (for animation)
                    return (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={(p) => addToCart(p, imgRef)}
                        imgRef={imgRef}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <footer className="footer">
              L&T – All rights reserved 2025 ©
            </footer>
          </>
        } />
        <Route path="/order" element={<OrderPage cartItems={cartItems} clearCart={() => setCartItems([])} />} />
      </Routes>
    </Router>
  );
}

export default App;



