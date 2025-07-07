import mongoose from 'mongoose';

// Define the schema
const counterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // ✅ Adds createdAt and updatedAt fields
  }
);

// ✅ Optional index for performance boost on frequent lookups
counterSchema.index({ name: 1 });

// Export the model
const Counter = mongoose.model('Counter', counterSchema);
export default Counter;
