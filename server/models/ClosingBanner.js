const mongoose = require('mongoose');

const ClosingBannerSchema = new mongoose.Schema({
  image_url:   { type: String, required: true },
  title:       { type: String },
  subtitle:    { type: String },
  btn_text:    { type: String },
  btn_link:    { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ClosingBanner', ClosingBannerSchema);
