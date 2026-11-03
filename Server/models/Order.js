const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  shipping: String,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  total: {
  type: Number,
  required: true
}

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);


