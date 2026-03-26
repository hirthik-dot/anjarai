const mongoose = require('mongoose');

const HeroSlideSchema = new mongoose.Schema({
  image_url:   { type: String, required: true },
  tag:         { type: String },
  title:       { type: String, required: true },
  subtitle:    { type: String },
  btn_text:    { type: String, default: 'Shop Now →' },
  btn_link:    { type: String, default: '/collections/all' },
  is_active:   { type: Boolean, default: true },
  sort_order:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', HeroSlideSchema);
