import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
  createProduct,
} from "../controllers/client.js";

const router = express.Router();

router.get("/products", getProducts);
router.post("/products", createProduct);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/geography", getGeography);

export default router;