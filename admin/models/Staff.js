import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Counter from "../../models/counterModel.js";

const StaffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee", "Supervisor"],
      default: "Employee",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    hireDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
StaffSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate unique staff ID using atomic counter to avoid duplicates
StaffSchema.pre('save', async function(next) {
  if (this.staffId) return next();
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'staffId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.staffId = `STF${String(counter.seq).padStart(4, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
StaffSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Staff = mongoose.model("Staff", StaffSchema);
export default Staff;