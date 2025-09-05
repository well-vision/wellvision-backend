import Staff from "../models/Staff.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import userModel from "../../models/userModel.js";

// Get all staff members
export const getStaff = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // Format sort
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };
      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
            { staffId: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const staff = await Staff.find(searchQuery)
      .select("-password") // Exclude password from response
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Staff.countDocuments(searchQuery);

    res.status(200).json({
      staff,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get single staff member
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findById(id).select("-password");
    
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json(staff);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create new staff member
export const createStaff = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { name, email, role, status, phoneNumber, department } = req.body;

    // Check if email already exists in Staff or Users collection
    const [existingStaff, existingUser] = await Promise.all([
      Staff.findOne({ email }),
      userModel.findOne({ email })
    ]);

    if (existingStaff || existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Assign default password for new staff accounts
    const DEFAULT_PASSWORD = process.env.DEFAULT_STAFF_PASSWORD || "Welcome123";

    // 1) Create Staff entry (password will be hashed by Staff pre-save hook)
    const newStaff = new Staff({
      name,
      email,
      password: DEFAULT_PASSWORD,
      role,
      status,
      phoneNumber,
      department,
    });

    const savedStaff = await newStaff.save();

    // 2) Create corresponding auth user to enable login
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const authUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    try {
      await authUser.save();
    } catch (userSaveErr) {
      // Rollback staff if user creation fails to keep data consistent
      await Staff.deleteOne({ _id: savedStaff._id });
      return res.status(500).json({ message: `Failed to create login user: ${userSaveErr.message}` });
    }

    // Prepare response (exclude password)
    const staffResponse = savedStaff.toObject();
    delete staffResponse.password;

    res.status(201).json({
      message: "Staff member created successfully",
      staff: staffResponse,
      user: { id: authUser._id, email: authUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update staff member
export const updateStaff = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const updateData = { ...req.body };

    // Remove password from update if it's empty
    if (!updateData.password || updateData.password.trim() === "") {
      delete updateData.password;
    }

    // Check if email is being changed and if it already exists
    if (updateData.email) {
      const existingStaff = await Staff.findOne({ 
        email: updateData.email, 
        _id: { $ne: id } 
      });
      if (existingStaff) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json({
      message: "Staff member updated successfully",
      staff: updatedStaff,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete staff member
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStaff = await Staff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json({
      message: "Staff member deleted successfully",
      staffId: deletedStaff.staffId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff statistics
export const getStaffStats = async (req, res) => {
  try {
    const totalStaff = await Staff.countDocuments();
    const activeStaff = await Staff.countDocuments({ status: "Active" });
    const inactiveStaff = await Staff.countDocuments({ status: "Inactive" });
    
    const roleStats = await Staff.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      totalStaff,
      activeStaff,
      inactiveStaff,
      roleStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};