const router       = require('express').Router();
const multer       = require('multer');
const cloudinary   = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const protect      = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'themotherscare',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    transformation: [{ width: 1500, height: 1500, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

// POST /api/upload/image  (admin only)
router.post('/image', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file received' });
  res.json({ url: req.file.path, filename: req.file.filename });
});

module.exports = router;
