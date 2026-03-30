const router = require('express').Router();
const ClientUser = require('../models/ClientUser');
const User = require('../models/User');
const protect = require('../middleware/auth');

// GET /api/clients/list (protected)
router.get('/list', protect, async (req, res) => {
  try {
    // The storefront uses OTP auth (User model), but older flows used ClientUser.
    // Return a unified list for the admin dashboard.
    const clientUsers = await ClientUser.find()
      .select('-password_hash')
      .sort({ created_at: -1 });

    const users = await User.find()
      .sort({ createdAt: -1 });

    const normalized = [
      ...clientUsers.map((u) => ({
        _id: u._id,
        full_name: u.full_name,
        email: u.email,
        phone: u.phone,
        email_verified: u.email_verified ?? false,
        is_active: u.is_active ?? true,
        created_at: u.created_at,
      })),
      ...users.map((u) => ({
        _id: u._id,
        full_name: u.name,
        email: u.email,
        phone: '',
        email_verified: u.email_verified ?? true,
        is_active: u.is_active ?? true,
        created_at: u.createdAt || u.created_at,
      })),
    ].sort((a, b) => {
      const bt = new Date(b.created_at || 0).getTime();
      const at = new Date(a.created_at || 0).getTime();
      return bt - at;
    });

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clients/toggle-status/:id (protected)
router.post('/toggle-status/:id', protect, async (req, res) => {
  try {
    const clientUser = await ClientUser.findById(req.params.id);
    if (clientUser) {
      clientUser.is_active = !clientUser.is_active;
      await clientUser.save();
      return res.json({ message: `User ${clientUser.is_active ? 'enabled' : 'disabled'} successfully`, is_active: clientUser.is_active });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.is_active = !user.is_active;
    await user.save();

    res.json({ message: `User ${user.is_active ? 'enabled' : 'disabled'} successfully`, is_active: user.is_active });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
