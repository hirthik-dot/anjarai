const mongoose = require('mongoose');

const FooterConfigSchema = new mongoose.Schema({
  brand_description: { type: String },
  whatsapp_number: { type: String, default: '+91 8940497627' },
  whatsapp_link: { type: String, default: 'https://wa.me/918940497627' },
  instagram_handle: { type: String, default: '@themothers_care' },
  location: { type: String, default: 'Tamil Nadu, India' },
  facebook_url: { type: String },
  instagram_url: { type: String },
  youtube_url: { type: String },
  threads_url: { type: String },
  quick_links: { type: [Object], default: [] }, // [{label, href}]
  category_links: { type: [Object], default: [] }, // [{label, href}]
  copyright: { type: String, default: '© 2026, Anjaraipetti. All rights reserved.' },
  powered_by_text: { type: String, default: 'Powered by Thirupathi G' },
  powered_by_link: { type: String, default: 'https://thirupathimech.github.io/dashBoard/aboutMe.html' },
}, { timestamps: true });

module.exports = mongoose.model('FooterConfig', FooterConfigSchema);
