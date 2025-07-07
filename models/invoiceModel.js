import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  description: { type: String },
  rs: {
    type: String,
    required: true,
    match: [/^\d+$/, 'Rs. must be a numeric string'],
  },
  cts: {
    type: String,
    required: true,
    match: [/^\d+$/, 'Cts. must be a numeric string'],
  },
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
  items: [itemSchema],
  amount: { type: String, required: true },
  advance: { type: String, required: true },
  balance: { type: String, required: true },
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
