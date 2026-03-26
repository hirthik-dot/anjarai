const routerFactory = (Model, name) => {
  const router    = require('express').Router();
  const protect   = require('../middleware/auth');
  const { getIO } = require('../socket');

  // GET (public — active items only, ordered)
  router.get('/', async (req, res) => {
    try {
      const items = await Model.find({ is_active: true }).sort('sort_order');
      res.json(items);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // GET admin/all (protected — all including inactive)
  router.get('/admin/all', protect, async (req, res) => {
    try {
      const items = await Model.find().sort('sort_order');
      res.json(items);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // POST — create
  router.post('/', protect, async (req, res) => {
    try {
      const item = await Model.create(req.body);
      getIO().emit(`${name}:created`, item);
      res.status(201).json({ id: item._id, message: 'Created' });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // PUT /:id — update
  router.put('/:id', protect, async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      getIO().emit(`${name}:updated`, item);
      res.json({ message: 'Updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // DELETE /:id
  router.delete('/:id', protect, async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      getIO().emit(`${name}:deleted`, req.params.id);
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
      await Model.bulkWrite(bulkOps);
      getIO().emit(`${name}:reordered`, order);
      res.json({ message: 'Reordered' });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  return router;
};

module.exports = routerFactory;
