const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  code:           { type: String, unique: true, required: true },
  discount_type:  { type: String, default: 'percent' }, // 'percent' | 'flat'
  discount_value: { type: Number, required: true },
  min_order:      { type: Number, default: 0 },
  max_uses:       { type: Number },
  used_count:     { type: Number, default: 0 },
  expires_at:     { type: Date },
  is_active:      { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);
