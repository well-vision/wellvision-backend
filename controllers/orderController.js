import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ placedAt: -1 }).lean();
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error('getOrders error', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('getOrderById error', err);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Order Received', 'Order place in Lab', 'In lab proccessing', 'Transit to shop', 'Ready for customer'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('updateOrderStatus error', err);
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
};

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderNumber, customerName, customerEmail, items = [], status = 'Order Received', total = 0 } = req.body;

    if (!orderNumber || !customerName) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'orderNumber and customerName are required' });
    }

    if (items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    // Check if order number already exists
    const exists = await Order.findOne({ orderNumber }).session(session);
    if (exists) {
      await session.abortTransaction();
      return res.status(409).json({ success: false, message: 'Order number already exists' });
    }

    // Validate and check stock for each item
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: 'Invalid item data: productId and positive quantity required' });
      }

      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
    }

    // Reduce stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    // Create the order
    const order = await Order.create([{
      orderNumber,
      customerName,
      customerEmail,
      items,
      status,
      total
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ success: true, data: order[0] });
  } catch (err) {
    await session.abortTransaction();
    console.error('createOrder error', err);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  } finally {
    session.endSession();
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    console.error('deleteOrder error', err);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};
