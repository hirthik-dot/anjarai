const router = require('express').Router();
const Offer = require('../models/Offer');

function normalizeCode(code) {
  return String(code || '').trim().toUpperCase();
}

function computeDiscountAmount({ offer, subtotal }) {
  const discountValue = Number(offer.discount_value) || 0;
  if (discountValue <= 0) return 0;

  let amount = 0;
  if (offer.discount_type === 'flat') {
    amount = discountValue;
  } else {
    // percent (default)
    amount = (subtotal * discountValue) / 100;
  }

  // Never discount more than subtotal
  amount = Math.min(amount, subtotal);
  return amount;
}

// POST /api/offers/promo/validate
// Body: { code: string, subtotal: number, shipping_fee?: number }
router.post('/validate', async (req, res) => {
  try {
    const code = normalizeCode(req.body?.code);
    const subtotal = Number(req.body?.subtotal) || 0;
    const shipping_fee = Number(req.body?.shipping_fee) || 0;

    if (!code) return res.status(400).json({ valid: false, error: 'Promo code is required' });
    if (subtotal <= 0) return res.status(400).json({ valid: false, error: 'Invalid cart subtotal' });

    const offer = await Offer.findOne({ code, is_active: true });
    if (!offer) return res.json({ valid: false, error: 'Invalid promo code' });

    if (offer.expires_at && offer.expires_at < new Date()) {
      return res.json({ valid: false, error: 'Promo code expired' });
    }

    if (offer.min_order && subtotal < Number(offer.min_order || 0)) {
      return res.json({ valid: false, error: `Minimum order is ₹${offer.min_order}` });
    }

    if (offer.max_uses != null && Number(offer.used_count || 0) >= Number(offer.max_uses || 0)) {
      return res.json({ valid: false, error: 'Promo code usage limit reached' });
    }

    const discount_amount = computeDiscountAmount({ offer, subtotal });
    const total_after_discount = Math.max(0, subtotal + shipping_fee - discount_amount);

    return res.json({
      valid: true,
      offer: {
        code: offer.code,
        discount_type: offer.discount_type,
        discount_value: offer.discount_value,
        discount_text: offer.discount,
        min_order: offer.min_order,
        max_uses: offer.max_uses,
      },
      subtotal,
      shipping_fee,
      discount_amount,
      total_after_discount,
    });
  } catch (err) {
    return res.status(500).json({ valid: false, error: 'Failed to validate promo code' });
  }
});

module.exports = router;

