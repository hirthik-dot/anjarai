const mongoose = require('mongoose');

const TaglineSchema = new mongoose.Schema({
  left_text:  { type: String, default: 'Sip Your Way To Health' },
  right_text: { type: String, default: '🎖️ FSSAI Certified & Lab Approved' },
});

module.exports = mongoose.model('Tagline', TaglineSchema);
