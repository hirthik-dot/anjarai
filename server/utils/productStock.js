const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const InventoryTransaction = require('../models/InventoryTransaction');
const Product = require('../models/Product');

/**
 * Merge inventory into product docs for public API (stock_total, stock_by_variant).
 */
async function attachStockToProducts(products) {
  if (!products || products.length === 0) return [];
  const list = products.map((p) => (p.toObject ? p.toObject() : { ...p }));
  const ids = list.map((p) => p._id);
  const rows = await Inventory.find({ product_id: { $in: ids } }).lean();
  const byProduct = {};
  for (const r of rows) {
    const pid = String(r.product_id);
    if (!byProduct[pid]) byProduct[pid] = { total: 0, byVariant: {} };
    const q = Number(r.quantity) || 0;
    byProduct[pid].total += q;
    const v = r.variant || 'default';
    byProduct[pid].byVariant[v] = (byProduct[pid].byVariant[v] || 0) + q;
  }
  return list.map((p) => {
    const pid = String(p._id);
    const s = byProduct[pid] || { total: 0, byVariant: {} };
    return { ...p, stock_total: s.total, stock_by_variant: s.byVariant };
  });
}

async function getAvailableStock(productId, variantKey) {
  const v = variantKey && variantKey !== 'default' ? String(variantKey) : 'default';
  let inv = await Inventory.findOne({ product_id: productId, variant: v });
  if (!inv && v !== 'default') {
    inv = await Inventory.findOne({ product_id: productId, variant: 'default' });
  }
  return inv ? Number(inv.quantity) || 0 : 0;
}

/**
 * Set Product.type to 'sold' only when total stock across variants is 0.
 */
async function syncProductTypeFromInventory(productId) {
  const pid = new mongoose.Types.ObjectId(productId);
  const agg = await Inventory.aggregate([
    { $match: { product_id: pid } },
    { $group: { _id: null, t: { $sum: '$quantity' } } },
  ]);
  const sum = agg[0]?.t || 0;
  await Product.findByIdAndUpdate(productId, { type: sum === 0 ? 'sold' : 'buy' });
}

async function deductInventoryForSale({
  productId,
  variant,
  qty,
  reference,
  performedBy = 'order',
}) {
  const variantKey = variant && String(variant) !== '' ? String(variant) : 'default';
  let inv = await Inventory.findOne({ product_id: productId, variant: variantKey });
  if (!inv && variantKey !== 'default') {
    inv = await Inventory.findOne({ product_id: productId, variant: 'default' });
  }
  if (!inv) {
    inv = new Inventory({
      product_id: productId,
      variant: variantKey,
      quantity: 0,
      reorder_level: 10,
    });
  }

  const qtyBefore = Number(inv.quantity) || 0;
  if (qtyBefore < qty) {
    const err = new Error('INSUFFICIENT_STOCK');
    err.code = 'INSUFFICIENT_STOCK';
    err.productId = productId;
    throw err;
  }

  const qtyAfter = qtyBefore - qty;
  inv.quantity = qtyAfter;
  inv.last_updated = new Date();
  await inv.save();

  await InventoryTransaction.create({
    inventory_id: inv._id,
    product_id: productId,
    variant: inv.variant,
    transaction_type: 'sale',
    quantity_change: -qty,
    quantity_before: qtyBefore,
    quantity_after: qtyAfter,
    reference: reference || '',
    notes: 'Order sale',
    performed_by: performedBy,
  });

  await syncProductTypeFromInventory(productId);
  return qtyAfter;
}

module.exports = {
  attachStockToProducts,
  getAvailableStock,
  syncProductTypeFromInventory,
  deductInventoryForSale,
};
