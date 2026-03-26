const mongoose = require('mongoose');

const NavbarConfigSchema = new mongoose.Schema({
  logo_text: { type: String, default: 'Anjaraipetti' },
  logo_sub: { type: String, default: 'Pure & Organic' },
  contact_text: { type: String, default: 'WhatsApp & Direct Call Support' },
  contact_num: { type: String, default: '+91 8940497627' },
  nav_links: [
    { label: { type: String }, link: { type: String } }
  ],
}, { timestamps: true });

module.exports = mongoose.model('NavbarConfig', NavbarConfigSchema);
