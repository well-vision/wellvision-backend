import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Import your routes
import customerRoutes from './routes/customerRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import authRoutes from './routes/authRoutes.js';       // 👈 from your auth system
import userRoutes from './routes/userRoutes.js';       // 👈 from your auth system
import forexRoutes from './routes/forexRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Load .env colocated with this file, regardless of process.cwd()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' })); // allow larger base64 profilePic
app.use(cookieParser()); // read JWT cookie

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/auth', authRoutes);       // 👈 mount auth routes
app.use('/api/user', userRoutes);       // 👈 mount user routes
app.use('/api/forex', forexRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handler Middleware (should be last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

// Connect to MongoDB and start the server
const mongoUri = (process.env.MONGODB_URI || '').toString().trim().replace(/^['"]|['"]$/g, '');

mongoose.connect(mongoUri).then(() => {
  console.log('✅ MongoDB Connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});
