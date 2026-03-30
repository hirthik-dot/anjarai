const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  // Promo code
  code: { type: String, unique: true, required: true, index: true },

  // Display fields (used by admin UI / potential frontend cards)
  title: { type: String },
  subtitle: { type: String },
  image_url: { type: String },
  link: { type: String },
  discount: { type: String }, // Human readable (e.g. "20% OFF")

  // Discount calculation
  discount_type: { type: String, enum: ['percent', 'flat'], default: 'percent' },
  discount_value: { type: Number, default: 0 },

  // Constraints / tracking
  min_order: { type: Number, default: 0 },
  max_uses: { type: Number },
  used_count: { type: Number, default: 0 },
  expires_at: { type: Date },
  is_active: { type: Boolean, default: true },

  // Ordering for admin drag-drop and public listing
  sort_order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);
