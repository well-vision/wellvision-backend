import Order from '../models/orderModel.js';

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
    const { orderNumber, customerName, customerEmail, items = [], status = 'Order Received', total = 0 } = req.body;

    if (!orderNumber || !customerName) {
      return res.status(400).json({ success: false, message: 'orderNumber and customerName are required' });
    }

    const exists = await Order.findOne({ orderNumber }).lean();
    if (exists) return res.status(409).json({ success: false, message: 'Order number already exists' });

    const order = await Order.create({ orderNumber, customerName, customerEmail, items, status, total });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error('createOrder error', err);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};
