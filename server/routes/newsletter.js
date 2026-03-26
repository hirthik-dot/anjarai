const router      = require('express').Router();
const Subscriber  = require('../models/NewsletterSubscriber');
const protect     = require('../middleware/auth');
const { getIO }   = require('../socket');

// POST /subscribe (public — from client Newsletter component)
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@'))
    return res.status(400).json({ error: 'Valid email required' });
  try {
    const sub = await Subscriber.create({ email: email.trim().toLowerCase() });
    getIO().emit('newsletter:subscribed', sub);
    res.json({ message: 'Subscribed successfully!' });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: 'This email is already subscribed.' });
    res.status(500).json({ error: err.message });
  }
});

// GET /subscribers (admin)
router.get('/subscribers', protect, async (req, res) => {
  try {
    const subs = await Subscriber.find().sort('-createdAt');
    res.json(subs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /subscribers/export.csv (admin)
router.get('/subscribers/export.csv', protect, async (req, res) => {
  try {
    const rows = await Subscriber.find().sort('-createdAt');
    const csv  = 'Email,Subscribed At\n' + rows.map(r => `${r.email},${r.createdAt}`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
    res.send(csv);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /subscribers/:id (admin)
router.delete('/subscribers/:id', protect, async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    getIO().emit('newsletter:unsubscribed', req.params.id);
    res.json({ message: 'Subscriber removed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
