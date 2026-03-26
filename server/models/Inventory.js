const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  product_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant:         { type: String, default: 'default' },
  quantity:        { type: Number, default: 0 },
  cost_price:      { type: Number },
  reorder_level:   { type: Number, default: 10 },
  reorder_qty:     { type: Number, default: 50 },
  location:        { type: String, default: 'Main Warehouse' },
  last_updated:    { type: Date, default: Date.now }
});

// Ensure product + variant combo is unique
InventorySchema.index({ product_id: 1, variant: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', InventorySchema);
