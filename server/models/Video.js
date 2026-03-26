const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  youtube_url:   { type: String, required: true },
  thumbnail_url: { type: String },
  title:         { type: String },
  is_active:     { type: Boolean, default: true },
  sort_order:    { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);
