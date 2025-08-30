import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ Updated import paths to point to admin folder
import AffiliateStat from "./admin/models/AffiliateStat.js";
import OverallStat from "./admin/models/OverallStat.js";
import Product from "./admin/models/Product.js";
import ProductStat from "./admin/models/ProductStat.js";
import Transaction from "./admin/models/Transaction.js";
import User from "./admin/models/User.js";

import {
  dataAffiliateStat,
  dataOverallStat,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataUser,
} from "./admin/data/index.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/admin_board";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await AffiliateStat.deleteMany({});
    await OverallStat.deleteMany({});
    await Product.deleteMany({});
    await ProductStat.deleteMany({});
    await Transaction.deleteMany({});
    await User.deleteMany({});

    console.log("Existing data cleared");

    // Insert data
    await AffiliateStat.insertMany(dataAffiliateStat);
    console.log("Inserted AffiliateStat data");

    await OverallStat.insertMany(dataOverallStat);
    console.log("Inserted OverallStat data");

    await Product.insertMany(dataProduct);
    console.log("Inserted Product data");

    await ProductStat.insertMany(dataProductStat);
    console.log("Inserted ProductStat data");

    await Transaction.insertMany(dataTransaction);
    console.log("Inserted Transaction data");

    await User.insertMany(dataUser);
    console.log("Inserted User data");

    console.log("Database seeding complete");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    mongoose.connection.close();
  }
}

seed();
