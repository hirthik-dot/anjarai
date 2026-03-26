const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  text:        { type: String, required: true },
  is_active:   { type: Boolean, default: true },
  sort_order:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
