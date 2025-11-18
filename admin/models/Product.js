import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    category: String,
    brand: String,
    model: String,
    cost: Number,
    stock: Number,
    reorderLevel: Number,
    frameMaterial: String,
    frameColor: String,
    lensType: String,
    prescription: Boolean,
    rating: Number,
    supply: Number,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;