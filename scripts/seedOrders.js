import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from '../models/orderModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoUri = (process.env.MONGODB_URI || '').toString().trim().replace(/^['"]|['"]$/g, '');

const sampleOrders = [
  {
    orderNumber: 'WV-2001',
    customerName: 'Sample Co',
    customerEmail: 'info@sample.co',
    items: [
      { sku: 'SKU-1', description: 'Widget A', quantity: 2, unitPrice: 100 },
      { sku: 'SKU-2', description: 'Widget B', quantity: 1, unitPrice: 220 },
    ],
  status: 'Order Received',
    total: 420,
  },
  {
    orderNumber: 'WV-2002',
    customerName: 'Example LLC',
    customerEmail: 'sales@example.com',
    items: [
      { sku: 'SKU-3', description: 'Widget C', quantity: 3, unitPrice: 50 },
    ],
  status: 'Order place in Lab',
    total: 150,
  },
];

async function seed() {
  if (!mongoUri) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  try {
    const inserted = await Order.insertMany(sampleOrders, { ordered: true });
    console.log('Inserted orders:', inserted.length);
  } catch (err) {
    console.error('Seed error:', err.message || err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();