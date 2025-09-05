import express from "express";
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffStats,
} from "../controllers/staff.js";
import { validateStaffCreation, validateStaffUpdate } from "../../validators/staffValidator.js";

const router = express.Router();

// GET /api/admin/staff - Get all staff members with pagination, sorting, and search
router.get("/", getStaff);

// GET /api/admin/staff/stats - Get staff statistics
router.get("/stats", getStaffStats);

// GET /api/admin/staff/:id - Get single staff member
router.get("/:id", getStaffById);

// POST /api/admin/staff - Create new staff member
router.post("/", validateStaffCreation, createStaff);

// PUT /api/admin/staff/:id - Update staff member
router.put("/:id", validateStaffUpdate, updateStaff);

// DELETE /api/admin/staff/:id - Delete staff member
router.delete("/:id", deleteStaff);

export default router;