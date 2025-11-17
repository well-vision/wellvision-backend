import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  description: { type: String },
  rs: { type: Number, required: true },
  cts: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  orderNo: { type: String, required: true },
  date: { type: Date, default: Date.now },
  billNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tel: {
    type: String,
    required: true,
    match: [/^(?:0|94|\+94)?(7[0-9]{8})$/, 'Invalid Sri Lankan phone number'],
  },
  address: { type: String, required: true },
  // Optional link back to the customer this invoice belongs to
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: false },
  items: [itemSchema],
  amount: { type: Number, required: true },
  advance: { type: Number, required: true },
  balance: { type: Number, required: true },
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
