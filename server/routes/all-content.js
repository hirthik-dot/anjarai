const router = require('express').Router();
const Product       = require('../models/Product');
const HeroSlide     = require('../models/HeroSlide');
const Announcement  = require('../models/Announcement');
const Tagline       = require('../models/Tagline');
const TrustItem     = require('../models/TrustItem');
const MarqueeItem   = require('../models/MarqueeItem');
const CategoryCard  = require('../models/CategoryCard');
const AboutStrip    = require('../models/AboutStrip');
const AdBanner      = require('../models/AdBanner');
const ClosingBanner = require('../models/ClosingBanner');
const Video         = require('../models/Video');
const FooterConfig  = require('../models/FooterConfig');
const NavbarConfig  = require('../models/NavbarConfig');

router.get('/', async (req, res) => {
  try {
    const [
      products, heroSlides, announcements, tagline, trustItems, marqueeItems,
      categories, about, ads, closingBanner, videos, footer, navbar
    ] = await Promise.all([
      Product.find({ is_active: true }).sort({ sort_order: 1 }),
      HeroSlide.find({ is_active: true }).sort({ sort_order: 1 }),
      Announcement.find({ is_active: true }).sort({ sort_order: 1 }),
      Tagline.findOne(),
      TrustItem.find({ is_active: true }).sort({ sort_order: 1 }),
      MarqueeItem.find({ is_active: true }).sort({ sort_order: 1 }),
      CategoryCard.find({ is_active: true }).sort({ sort_order: 1 }),
      AboutStrip.findOne(),
      AdBanner.find({ is_active: true }).sort({ sort_order: 1 }),
      ClosingBanner.findOne(),
      Video.find({ is_active: true }).sort({ sort_order: 1 }),
      FooterConfig.findOne(),
      NavbarConfig.findOne()
    ]);

    res.json({
      products, heroSlides, announcements, tagline, trustItems, marqueeItems,
      categories, about, ads, closingBanner, videos, footer, navbar
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
