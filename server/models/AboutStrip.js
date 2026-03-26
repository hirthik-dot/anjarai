const mongoose = require('mongoose');

const AboutStripSchema = new mongoose.Schema({
  image_url:   { type: String, required: true },
  title:       { type: String, required: true },
  body:        { type: String, required: true },
  badges:      { type: [String], default: [] },
  btn_text:    { type: String, default: 'Shop Now →' },
  btn_link:    { type: String, default: '/collections/all' },
}, { timestamps: true });

module.exports = mongoose.model('AboutStrip', AboutStripSchema);
