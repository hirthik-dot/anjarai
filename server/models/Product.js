const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id:              { type: String, primaryKey: true, required: true },
  slug:            { type: String, unique: true, required: true },
  name:            { type: String, required: true },
  price:           { type: Number, required: true },
  original_price:  { type: Number },
  images:          { type: [String], default: [] },
  sale:            { type: Boolean, default: false },
  rating:          { type: Number, default: 5 },
  reviews:         { type: Number, default: 0 },
  collections:     { type: [String], default: ["all"] },
  variants:        { type: [String], default: [] },
  type:            { type: String, default: "buy" },
  description:     { type: String },
  benefits:        { type: [String], default: [] },
  ingredients:     { type: String },
  how_to_use:      { type: String },
  fssai:           { type: Boolean, default: true },
  is_active:       { type: Boolean, default: true },
  sort_order:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
