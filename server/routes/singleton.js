const singletonFactory = (Model, name) => {
  const router    = require('express').Router();
  const protect   = require('../middleware/auth');
  const { getIO } = require('../socket');

  // GET (public)
  router.get('/', async (req, res) => {
    try {
      const item = await Model.findOne();
      res.json(item || {});
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // PUT — update
  router.put('/', protect, async (req, res) => {
    try {
      let item = await Model.findOne();
      if (!item) {
        item = await Model.create(req.body);
      } else {
        item = await Model.findOneAndUpdate({}, req.body, { new: true });
      }
      getIO().emit(`${name}:updated`, item);
      res.json({ message: 'Updated' });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  return router;
};

module.exports = singletonFactory;
