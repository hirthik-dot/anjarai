/**
 * reset-admin.js
 * Run: node reset-admin.js
 * This script resets the admin username and password to known values.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const NEW_USERNAME = 'admin';
const NEW_PASSWORD = 'admin123';

async function resetAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/themotherscare';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const Admin = require('./models/Admin');

    // Delete ALL existing admin records and create fresh one
    const deleted = await Admin.deleteMany({});
    console.log(`🗑️  Removed ${deleted.deletedCount} existing admin record(s)`);

    const hash = bcrypt.hashSync(NEW_PASSWORD, 10);
    await Admin.create({ username: NEW_USERNAME, password_hash: hash });

    console.log('');
    console.log('✅ Admin credentials reset successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Username : ${NEW_USERNAME}`);
    console.log(`   Password : ${NEW_PASSWORD}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

resetAdmin();
