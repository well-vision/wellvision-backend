import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Staff from '../admin/models/Staff.js';

dotenv.config();

const staffData = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@wellvision.com",
    password: "Password123",
    role: "Manager",
    status: "Active",
    phoneNumber: "5551234567",
    department: "Operations",
  },
  {
    name: "Bob Smith",
    email: "bob.smith@wellvision.com",
    password: "Password123",
    role: "Employee",
    status: "Active",
    phoneNumber: "5559876543",
    department: "Sales",
  },
  {
    name: "Carol Davis",
    email: "carol.davis@wellvision.com",
    password: "Password123",
    role: "Supervisor",
    status: "Active",
    phoneNumber: "5555551234",
    department: "Customer Service",
  },
  {
    name: "David Wilson",
    email: "david.wilson@wellvision.com",
    password: "Password123",
    role: "Employee",
    status: "Inactive",
    phoneNumber: "5557778888",
    department: "IT Support",
  },
  {
    name: "Emma Brown",
    email: "emma.brown@wellvision.com",
    password: "Password123",
    role: "Admin",
    status: "Active",
    phoneNumber: "5553334444",
    department: "Administration",
  },
];

const seedStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing staff data
    await Staff.deleteMany({});
    console.log('Cleared existing staff data');

    // Insert new staff data
    await Staff.insertMany(staffData);
    console.log('Staff data seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding staff data:', error);
    process.exit(1);
  }
};

seedStaff();