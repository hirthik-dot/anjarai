const router = require('express').Router();
const ClientUser = require('../models/ClientUser');
const protect = require('../middleware/auth');

// GET /api/clients/list (protected)
router.get('/list', protect, async (req, res) => {
  try {
    // Return all customer accounts for the admin dashboard
    const users = await ClientUser.find()
      .select('-password_hash') // Don't send hashes
      .sort({ created_at: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clients/toggle-status/:id (protected)
router.post('/toggle-status/:id', protect, async (req, res) => {
  try {
    const user = await ClientUser.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.is_active = !user.is_active;
    await user.save();
    
    res.json({ message: `User ${user.is_active ? 'enabled' : 'disabled'} successfully`, is_active: user.is_active });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
