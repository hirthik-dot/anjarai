const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    image: { type: String }
  }],
  shipping_address: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  subtotal: { type: Number, required: true },
  shipping_fee: { type: Number, default: 0 },
  total_amount: { type: Number, required: true },
  payment_method: { type: String, enum: ['RAZORPAY', 'COD'], default: 'RAZORPAY' },
  payment_status: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  order_status: { type: String, enum: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PROCESSING' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
