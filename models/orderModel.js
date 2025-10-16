import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true, default: 0 },
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['Order Received', 'Order place in Lab', 'In lab proccessing', 'Transit to shop', 'Ready for customer'],
    default: 'Order Received',
  },
  total: { type: Number, required: true, default: 0 },
  placedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
