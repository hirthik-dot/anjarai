const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String },
  image_url:   { type: String },
  is_active:   { type: Boolean, default: true },
  sort_order:  { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Collection', CollectionSchema);
