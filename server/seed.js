require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');

// Models
const Product = require('./models/Product');
const HeroSlide = require('./models/HeroSlide');
const Announcement = require('./models/Announcement');
const Tagline = require('./models/Tagline');
const TrustItem = require('./models/TrustItem');
const MarqueeItem = require('./models/MarqueeItem');
const CategoryCard = require('./models/CategoryCard');
const AboutStrip = require('./models/AboutStrip');
const AdBanner = require('./models/AdBanner');
const ClosingBanner = require('./models/ClosingBanner');
const Video = require('./models/Video');
const FooterConfig = require('./models/FooterConfig');
const Offer = require('./models/Offer');

const products = [
  {
    id: 'p1', slug: 'sprouted-ragi-powder-copy', name: '5-in-1 Weight Gain Nutrii Drink',
    price: 270, original_price: 675,
    images: ['https://www.themotherscare.com/cdn/shop/files/5-IN-1WEIGHTGAINNUTRIIDRINKMOCKUP_a5ad1f2d-a49f-4ffc-8127-e3bc9d1c3ed6.png?v=1771966775&width=533'],
    sale: true, rating: 5, reviews: 0, collections: ['all', 'best-sellers', 'instant-health-drink'],
    variants: ['200g', '500g'], type: 'buy',
    description: 'A powerful 5-in-1 weight gain drink for babies packed with sprouted ragi, nuts, and natural ingredients.',
    benefits: ['Supports healthy weight gain', 'Rich in calcium and iron', 'Natural ingredients only', 'No added sugar or preservatives'],
    ingredients: 'Sprouted Ragi, Sprouted Green Gram, Sprouted Horse Gram, Badam, Cashew, Pista',
    how_to_use: 'Mix 2-3 tsp in warm milk or water. Serve warm or cold.', fssai: true
  },
  {
    id: 'p2', slug: 'abcg-milk-mix', name: 'ABCG Milk Mix',
    price: 350, original_price: null,
    images: ['https://www.themotherscare.com/cdn/shop/files/ABCG_MILK_MIX_MOCKUP_fe26d837-e152-4882-8918-205cc382c50d.png?v=1771965661&width=533'],
    sale: false, rating: 5, reviews: 0, collections: ['all', 'best-sellers'],
    variants: ['200g', '500g'], type: 'buy',
    description: 'ABCG Milk Mix – a nutritious blend of Almond, Badam, Cashew, and Green Gram designed for toddlers.',
    benefits: ['High protein content', 'Brain development support', 'Natural milk enhancer', 'No artificial flavors'],
    ingredients: 'Almond, Badam, Cashew, Green Gram, Dates',
    how_to_use: 'Mix 2 tsp in warm milk. Stir well and serve.', fssai: true
  },
  // Adding placeholders for other products to reach 27
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `p${i + 3}`,
    slug: `product-${i + 3}`,
    name: `Homemade Powder Product ${i + 3}`,
    price: 300 + (i * 10),
    original_price: 600 + (i * 20),
    images: [`https://www.themotherscare.com/cdn/shop/files/ProductPlaceholder.png`],
    sale: true,
    rating: 5,
    reviews: Math.floor(Math.random() * 50),
    collections: ['all'],
    variants: ['200g'],
    type: 'buy',
    description: 'This is a nutrient-rich organic product for your baby.',
    benefits: ['100% Organic', 'No preservatives'],
    ingredients: 'Natural grains and nuts',
    how_to_use: 'Mix with warm water.',
    fssai: true,
    is_active: true,
    sort_order: i + 3
  }))
];

const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');

const seed = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Seed Connection: ${conn.connection.host}`);

    // Seed Data
    console.log('🌱 Starting Seeder...');

    // 0. Admin
    if (await Admin.countDocuments() === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password_hash: hashedPassword
      });
      console.log('✅ Admin user seeded (admin / admin123)');
    }

    // 1. Tagline
    if (await Tagline.countDocuments() === 0) {
      await Tagline.create({
        left_text: 'Sip Your Way To Health',
        right_text: '🎖️ FSSAI Certified & Lab Approved'
      });
      console.log('✅ Tagline seeded');
    }

    // 2. Announcements
    if (await Announcement.countDocuments() === 0) {
      await Announcement.insertMany([
        { text: '🚚 Free Shipping on Orders Above ₹500 📍 Tamil Nadu addresses only', sort_order: 0 },
        { text: '📦 Free Shipping on Orders Above ₹1499 🇮🇳 For all other states', sort_order: 1 }
      ]);
      console.log('✅ Announcements seeded');
    }

    // 3. Hero Slides
    if (await HeroSlide.countDocuments() === 0) {
      const B = 'https://www.themotherscare.com/cdn/shop/files/';
      await HeroSlide.insertMany([
        { image_url: B + 'SS_AD.png?v=1771970821&width=1200', tag: 'New Arrival', title: 'Nourish Your Little One Naturally', subtitle: '100% organic, homemade baby food powders crafted with love', btn_text: 'Shop Now →', btn_link: '/collections/all', sort_order: 0 },
        { image_url: B + 'ate_bby_with_mother.png?v=1769369603&width=1200', tag: 'Best Seller', title: "Pure. Natural. Made with The Anjaraipetti", subtitle: 'FSSAI Certified & Lab Approved – safe for every stage', btn_text: 'Explore →', btn_link: '/collections/best-sellers', sort_order: 1 },
        { image_url: B + 'smile_bby_mother.jpg?v=1768136111&width=1200', tag: 'Combo Packs', title: "From Our Heart to Baby's First Smile", subtitle: 'Save more with our Power Nutrition Combo Packs', btn_text: 'View Combos →', btn_link: '/collections/mega-combo-offers', sort_order: 2 },
        { image_url: B + 'ad_TMC.png?v=1771970218&width=1200', tag: 'Organic', title: 'No Sugar. No Preservatives. Just Goodness.', subtitle: 'Baby food the way nature intended it', btn_text: 'Shop Organic →', btn_link: '/collections/baby-organic', sort_order: 3 },
        { image_url: B + 'ad_tmc2.png?v=1771971492&width=1200', tag: 'Free Shipping', title: 'Sip Your Way To Health', subtitle: 'Free delivery across Tamil Nadu on orders above ₹500', btn_text: 'Order Now →', btn_link: '/collections/all', sort_order: 4 }
      ]);
      console.log('✅ Hero Slides seeded');
    }

    // 4. Trust Items
    if (await TrustItem.countDocuments() === 0) {
      await TrustItem.insertMany([
        { icon: '🏅', title: 'FSSAI Certified', subtitle: 'Lab Approved & Safe', sort_order: 0 },
        { icon: '🌿', title: '100% Organic', subtitle: 'No Chemicals Added', sort_order: 1 },
        { icon: '🚚', title: 'Free Shipping', subtitle: 'Orders above ₹500', sort_order: 2 },
        { icon: '❤️', title: 'Made with Love', subtitle: 'By Mothers, For Babies', sort_order: 3 },
        { icon: '📞', title: 'WhatsApp Support', subtitle: '+91 8940497627', sort_order: 4 }
      ]);
      console.log('✅ Trust Items seeded');
    }

    // 5. Marquee Items
    if (await MarqueeItem.countDocuments() === 0) {
      const items = ['No added white or brown sugar', 'No added Preservatives', 'No added chemicals', 'No added adulterants', '100% pure organic', 'FSSAI Certified', 'Lab Approved', 'Homemade recipes'];
      await MarqueeItem.insertMany(items.map((text, i) => ({ text, sort_order: i })));
      console.log('✅ Marquee Items seeded');
    }

    // 6. Categories
    if (await CategoryCard.countDocuments() === 0) {
      const B = 'https://www.themotherscare.com/cdn/shop/collections/';
      await CategoryCard.insertMany([
        { image_url: B + '1000167357.png?v=1771969825&width=1500', label: 'Mega Combo Offers', link: '/collections/mega-combo-offers', sort_order: 0 },
        { image_url: B + '1000167356.png?v=1771969181&width=1500', label: 'Baby Organic', link: '/collections/baby-organic', sort_order: 1 },
        { image_url: B + '1000167355.png?v=1771969058&width=1500', label: 'Best Sellers', link: '/collections/best-sellers', sort_order: 2 }
      ]);
      console.log('✅ Categories seeded');
    }

    // 7. About Strip
    if (await AboutStrip.countDocuments() === 0) {
      await AboutStrip.create({
        image_url: 'https://www.themotherscare.com/cdn/shop/files/Powder_center_Baby.jpg?v=1768128034&width=1500',
        title: '❤️ Made for Babies, Trusted by Mothers',
        body: 'At The Anjaraipetti, every product is crafted with the same love and care a mother gives her child. We use only 100% natural, homemade ingredients — no preservatives, no added sugar, no chemicals. Because your baby deserves nothing but the best.',
        badges: ['No added white or brown sugar', 'No added Preservatives', 'No added chemicals', 'No added adulterants', '100% pure organic'],
        btn_text: 'Shop Now →',
        btn_link: '/collections/all'
      });
      console.log('✅ About Strip seeded');
    }

    // 8. Closing Banner
    if (await ClosingBanner.countDocuments() === 0) {
      await ClosingBanner.create({
        image_url: 'https://www.themotherscare.com/cdn/shop/files/smile_bby_mother.jpg?v=1768136111&width=1500',
        title: "From Our Family to Yours",
        subtitle: 'Pure. Organic. Made with Love.',
        btn_text: 'Shop All Products →',
        btn_link: '/collections/all'
      });
      console.log('✅ Closing Banner seeded');
    }

    // 9. Footer
    if (await FooterConfig.countDocuments() === 0) {
      await FooterConfig.create({
        brand_description: 'Homemade baby food powders crafted with love. FSSAI Certified, Lab Approved, 100% Organic. Trusted by mothers across India.',
        whatsapp_number: '+91 8940497627',
        whatsapp_link: 'https://wa.me/918940497627',
        instagram_handle: '@the_anjaraipetti',
        location: 'Tamil Nadu, India',
        facebook_url: 'https://www.facebook.com/share/1GsdY85Gqv',
        instagram_url: 'https://www.instagram.com/the_anjaraipetti/',
        youtube_url: 'https://www.youtube.com/@TheAnjaraipetti',
        threads_url: 'https://www.threads.com/@the_anjaraipetti',
        quick_links: [
          { label: 'Shipping Policy', href: '/shipping' },
          { label: 'Refund Policy', href: '/refund' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Contact Information', href: '/contact' }
        ],
        category_links: [
          { label: 'Baby Organic', href: '/collections/baby-organic' },
          { label: 'Best Sellers', href: '/collections/best-sellers' },
          { label: 'Combo Packs', href: '/collections/mega-combo-offers' },
          { label: 'Instant Drinks', href: '/collections/instant-health-drink' },
          { label: 'Skin & Hair Care', href: '/collections/skin-hair' }
        ],
        copyright: '© 2026, The Anjaraipetti. All rights reserved.',
        powered_by_text: 'Powered by Thirupathi G',
        powered_by_link: 'https://thirupathimech.github.io/dashBoard/aboutMe.html'
      });
      console.log('✅ Footer seeded');
    }

    // 10. Products
    if (await Product.countDocuments() < 27) {
      await Product.deleteMany({}); // Reset for seeding to ensure exact count
      await Product.insertMany(products);
      console.log('✅ Products seeded (27 total)');
    }

    console.log('🎉 Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seed();
