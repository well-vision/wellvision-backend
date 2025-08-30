// scripts/createAdminUser.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js'; // Adjust path if needed

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = 'admin@example.com';
    const plainPassword = 'Admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existing = await userModel.findOne({ email });

    if (existing) {
      console.log('❗ Admin user already exists.');
      process.exit(0);
    }

    const adminUser = new userModel({
      name: 'Admin User',
      email,
      password: hashedPassword,
      isAccountVerified: true,
      // Role is optional if you're not using role logic
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create admin:', err);
    process.exit(1);
  }
};

createAdminUser();
