import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import your routes
import customerRoutes from './routes/customerRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import authRoutes from './routes/authRoutes.js';       // 👈 from your auth system
import userRoutes from './routes/userRoutes.js';       // 👈 from your auth system

import adminClientRoutes from './admin/routes/client.js';
import adminGeneralRoutes from './admin/routes/general.js';
import adminSalesRoutes from './admin/routes/sales.js';
import adminManagementRoutes from './admin/routes/management.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/auth', authRoutes);       // 👈 mount auth routes
app.use('/api/user', userRoutes);       // 👈 mount user routes

app.use('/api/admin/client', adminClientRoutes);
app.use('/api/admin/general', adminGeneralRoutes);
app.use('/api/admin/sales', adminSalesRoutes);
app.use('/api/admin/management', adminManagementRoutes);


// Error Handler Middleware (should be last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});
