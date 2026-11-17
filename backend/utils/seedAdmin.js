const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinereview';
    await mongoose.connect(uri);
    console.log(' Connected to MongoDB for seeding admin...');

    const adminEmail = 'admin@cinereview.com';
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      existing.role = 'admin';
      await existing.save();
      console.log(` Admin account already exists: ${adminEmail}`);
    } else {
      await User.create({
        name: 'CineReview Admin',
        email: adminEmail,
        password: 'Admin@123456',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      });
      console.log(' Default admin account created successfully:');
      console.log('   Email: admin@cinereview.com');
      console.log('   Password: Admin@123456');
    }

    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB. Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding admin account:', error.message);
    process.exit(1);
  }
};

seedAdmin();
