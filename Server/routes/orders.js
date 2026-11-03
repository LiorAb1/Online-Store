const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, shipping, items, total } = req.body;

    // Validation: check required fields
    if (!name || !email || !phone || !address || !shipping || !items || items.length === 0 || total <= 0) {
      return res.status(400).json({ error: 'Please fill in all required fields and include at least one item in your cart.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email.' });
    }

    // Create and save new order
    const newOrder = new Order({
      name,
      email,
      phone,
      address,
      shipping,
      items,
      total
    });

    const savedOrder = await newOrder.save();

    // Respond with success message and order ID
    res.status(201).json({
      message: 'Order placed successfully',
      orderId: savedOrder._id
    });

  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;




