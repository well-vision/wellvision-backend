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
  try {
    console.log('Received order data:', req.body);
    const { orderNumber, customerName, customerEmail, items = [], status = 'Order Received', total = 0 } = req.body;

    if (!orderNumber || !customerName) {
      return res.status(400).json({ success: false, message: 'orderNumber and customerName are required' });
    }

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    // Check if order number already exists
    const exists = await Order.findOne({ orderNumber });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Order number already exists' });
    }

    // Validate items and check stock availability
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid item data: productId and positive quantity required' });
      }

      // Check if product exists and has sufficient stock
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product with ID ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
    }

    console.log('Creating order with items:', items);

    // Start a transaction to ensure atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create the order
      const order = await Order.create([{
        orderNumber,
        customerName,
        customerEmail,
        items,
        status,
        total
      }], { session });

      // Update product stock levels
      for (const item of items) {
        await Product.findByIdAndUpdate(
          item.productId,
          {
            $inc: {
              stock: -item.quantity,
              totalSold: item.quantity
            },
            lastStockUpdate: new Date()
          },
          { session }
        );
      }

      // Commit the transaction
      await session.commitTransaction();
      console.log('Order created successfully with stock updates:', order[0]);
      res.status(201).json({ success: true, data: order[0] });

    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.error('createOrder error:', err);
    console.error('Error details:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ success: false, message: 'Failed to create order: ' + err.message });
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
