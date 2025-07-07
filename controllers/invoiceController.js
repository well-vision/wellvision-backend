import InvoiceModel from '../models/invoiceModel.js'; // Your invoice schema/model
import Counter from '../models/counterModel.js'; // The counter model we discussed

// Function to get next sequence number
async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// Controller function to create invoice
export const createInvoice = async (req, res) => {
  try {
    const billNo = await getNextSequence('billNo');

    const invoice = new InvoiceModel({
      ...req.body,
      billNo,
      date: req.body.date || new Date(),  // default to now if not provided
    });

    await invoice.save();

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
