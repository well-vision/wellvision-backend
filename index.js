import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// Wellvision Routes
import customerRoutes from './routes/customerRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Admin Routes
import adminClientRoutes from './admin/routes/client.js';
import adminGeneralRoutes from './admin/routes/general.js';
import adminSalesRoutes from './admin/routes/sales.js';
import adminManagementRoutes from './admin/routes/management.js';

// Admin Data Models (for seeding, if needed)
import User from './admin/models/User.js';
import Product from './admin/models/Product.js';
import ProductStat from './admin/models/ProductStat.js';
import Transaction from './admin/models/Transaction.js';
import OverallStat from './admin/models/OverallStat.js';
import AffiliateStat from './admin/models/AffiliateStat.js';
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from './admin/data/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // Already included in body-parser.json, but kept for compatibility

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Admin Routes (prefixed with /api/admin for consistency)
app.use('/api/admin/client', adminClientRoutes);
app.use('/api/admin/general', adminGeneralRoutes);
app.use('/api/admin/sales', adminSalesRoutes);
app.use('/api/admin/management', adminManagementRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

// MongoDB Connection and Server Start
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ MongoDB Connected');

    // Optional: Seed data only if an environment variable is set (e.g., SEED_DATA=true)
    if (process.env.SEED_DATA === 'true') {
      try {
        await User.insertMany(dataUser);
        await Product.insertMany(dataProduct);
        await ProductStat.insertMany(dataProductStat);
        await Transaction.insertMany(dataTransaction);
        await OverallStat.insertMany(dataOverallStat);
        await AffiliateStat.insertMany(dataAffiliateStat);
        console.log('🌱 Data seeded successfully');
      } catch (error) {
        console.error('❌ Error seeding data:', error);
      }
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
  });