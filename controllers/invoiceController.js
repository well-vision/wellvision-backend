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

    // Optional: send notifications if enabled in user settings
    try {
      const userId = req.user?.id;
      if (userId) {
        const user = await (await import('../models/userModel.js')).default.findById(userId).select('email phone name settings');
        // Email
        if (user && user.settings?.notifications?.emailNotifications) {
          const transporter = (await import('../config/nodemailer.js')).default;
          await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: `Invoice ${invoice.billNo} saved`,
            text: `Hello ${user.name || ''}, your invoice ${invoice.billNo} has been saved.`.trim()
          });
        }
        // SMS
        if (user && user.settings?.notifications?.smsNotifications && user.phone) {
          const { sendSms } = await import('../utils/smsClient.js');
          await sendSms({ to: user.phone, body: `Invoice ${invoice.billNo} saved. Thank you - WellVision` });
        }
      }
    } catch (e) {
      // Do not fail invoice creation if notification fails
      console.warn('Invoice notify failed:', e.message);
    }

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
