const mongoose = require('mongoose');

const InventoryTransactionSchema = new mongoose.Schema({
  inventory_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  product_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant:         { type: String, default: 'default' },
  transaction_type: { 
    type: String, 
    enum: ['stock_in', 'stock_out', 'adjustment', 'sale', 'return'],
    required: true 
  },
  quantity_change: { type: Number, required: true },
  quantity_before: { type: Number, required: true },
  quantity_after:  { type: Number, required: true },
  reference:       { type: String },
  notes:           { type: String },
  performed_by:    { type: String, default: 'admin' },
  created_at:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryTransaction', InventoryTransactionSchema);
