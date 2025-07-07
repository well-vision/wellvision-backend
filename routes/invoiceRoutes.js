// routes/invoiceRoutes.js
import express from 'express';
import { createInvoice } from '../controllers/invoiceController.js';
import Counter from '../models/counterModel.js';

const router = express.Router();

// Route: Preview next Bill No (does NOT increment counter)
router.get('/preview-bill-no', async (req, res) => {
  try {
    const counter = await Counter.findOne({ name: 'billNo' });
    const nextSeq = (counter?.seq || 0) + 1;
    const formattedBillNo = `INV-${String(nextSeq).padStart(4, '0')}`;

    res.json({ success: true, nextBillNo: formattedBillNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error previewing Bill No' });
  }
});

// Route: Get and increment the next Bill No (not usually needed if create handles it)
router.get('/next-bill-no', async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'billNo' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const formattedBillNo = `INV-${String(counter.seq).padStart(4, '0')}`;

    res.json({ success: true, nextBillNo: formattedBillNo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error generating Bill No' });
  }
});

// Route: Create a new invoice (auto-generates billNo internally)
router.post('/create', createInvoice);

export default router;
