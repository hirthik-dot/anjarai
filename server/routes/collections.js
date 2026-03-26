const router     = require('express').Router();
const Collection = require('../models/Collection');
const protect    = require('../middleware/auth');
const { getIO }  = require('../socket');

// Public
router.get('/', async (req, res) => {
  try { res.json(await Collection.find({ is_active: true }).sort({ sort_order: 1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin All
router.get('/admin/all', protect, async (req, res) => {
  try { res.json(await Collection.find().sort({ sort_order: 1 })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const col = await Collection.create(req.body);
    getIO().emit('collections:created', col);
    res.json(col);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const col = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    getIO().emit('collections:updated', col);
    res.json(col);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    getIO().emit('collections:deleted', { id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
