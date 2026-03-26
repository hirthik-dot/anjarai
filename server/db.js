const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/themotherscare');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Seed Admin if not exists
    const Admin = require('./models/Admin');
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await Admin.create({ username: 'admin', password_hash: hash });
      console.log('✅ Default Admin seeded — username: admin | password: admin123');
    }
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
