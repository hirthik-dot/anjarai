const mongoose = require('mongoose');

const CategoryCardSchema = new mongoose.Schema({
  image_url:   { type: String, required: true },
  label:       { type: String, required: true },
  link:        { type: String, required: true },
  is_active:   { type: Boolean, default: true },
  sort_order:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('CategoryCard', CategoryCardSchema);
