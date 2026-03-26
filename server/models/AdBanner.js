const mongoose = require('mongoose');

const AdBannerSchema = new mongoose.Schema({
  title:       { type: String, required: true }, // Internal label
  sticker:     { type: String, default: 'EXCLUSIVE OFFER' },
  heading_1:   { type: String, default: 'THE MOTHERS' },
  heading_2:   { type: String, default: 'CARE' },
  subtitle:    { type: String, default: 'HOMEMADE WITH PURITY AND LOVE FOR YOUR LITTLE ONES. 🌿' },
  btn_text:    { type: String, default: 'SHOP OFFERS →' },
  btn_link:    { type: String, default: '/' },
  footer_text: { type: String, default: 'FSSAI CERTIFIED \nLAB APPROVED' },
  image_url:   { type: String },
  is_active:   { type: Boolean, default: true },
  sort_order:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('AdBanner', AdBannerSchema);
