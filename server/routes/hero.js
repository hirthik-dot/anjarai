const router    = require('express').Router();
const HeroSlide = require('../models/HeroSlide');
const protect   = require('../middleware/auth');
const { getIO } = require('../socket');

// GET (public — active items only, ordered)
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find({ is_active: true }).sort('sort_order');
    res.json(slides);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET admin/all (protected — all including inactive)
router.get('/admin/all', protect, async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort('sort_order');
    res.json(slides);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST — create
router.post('/', protect, async (req, res) => {
  try {
    const slide = await HeroSlide.create(req.body);
    getIO().emit('hero:created', slide);
    res.status(201).json({ id: slide._id, message: 'Created' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /:id — update
router.put('/:id', protect, async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    getIO().emit('hero:updated', slide);
    res.json({ message: 'Updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    getIO().emit('hero:deleted', req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /reorder
router.post('/reorder', protect, async (req, res) => {
  const { order } = req.body;
  try {
    const bulkOps = order.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { sort_order: index }
      }
    }));
    await HeroSlide.bulkWrite(bulkOps);
    getIO().emit('hero:reordered', order);
    res.json({ message: 'Reordered' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
