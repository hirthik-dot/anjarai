const mongoose = require('mongoose');

const TrustItemSchema = new mongoose.Schema({
  icon:        { type: String, required: true },
  title:       { type: String, required: true },
  subtitle:    { type: String },
  is_active:   { type: Boolean, default: true },
  sort_order:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('TrustItem', TrustItemSchema);
