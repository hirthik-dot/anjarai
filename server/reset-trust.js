const mongoose = require('mongoose');
const TrustItem = require('./models/TrustItem');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/anjaraipetti')
  .then(async () => {
    await TrustItem.deleteMany({});
    
    // Clean, scalable SVGs from Lucide/Heroicons
    const iconLeaf = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
    const iconAward = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`;
    const iconTruck = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><path d="M7 14h0"/><circle cx="17" cy="18" r="2"/></svg>`;
    const iconHeart = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

    const items = [
      {
        icon: iconLeaf,
        title: '100% Organic',
        subtitle: 'No Chemicals Added',
        sort_order: 1
      },
      {
        icon: iconAward,
        title: 'FSSAI Certified',
        subtitle: 'Lab Approved & Safe',
        sort_order: 2
      },
      {
        icon: iconTruck,
        title: 'Free Shipping',
        subtitle: 'Orders above ₹500',
        sort_order: 3
      },
      {
        icon: iconHeart,
        title: 'Made with Love',
        subtitle: 'Be Healthier',
        sort_order: 4
      }
    ];

    for (let item of items) {
      await TrustItem.create(item);
    }
    console.log("Database reset to minimal layout successfully!");
    process.exit(0);
  });
