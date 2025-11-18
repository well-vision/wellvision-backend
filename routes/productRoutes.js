import express from 'express';
import Product from '../admin/models/Product.js';

const router = express.Router();

// GET: list all products (used by customer Products page)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      products,
    });
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: err.message,
    });
  }
});

// POST: create a new product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      model,
      price,
      cost,
      stock,
      reorderLevel,
      description,
      frameMaterial,
      frameColor,
      lensType,
      prescription,
      rating,
    } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required',
      });
    }

    const numericPrice = Number(price);
    const numericCost = cost === undefined || cost === null ? 0 : Number(cost);
    const numericStock = stock === undefined || stock === null ? 0 : Number(stock);
    const numericReorder =
      reorderLevel === undefined || reorderLevel === null
        ? 0
        : Number(reorderLevel);

    if (Number.isNaN(numericPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid number',
      });
    }

    const product = new Product({
      name,
      category,
      brand,
      model,
      price: numericPrice,
      cost: numericCost,
      stock: numericStock,
      reorderLevel: numericReorder,
      description,
      frameMaterial,
      frameColor,
      lensType,
      prescription: Boolean(prescription),
      rating,
      // keep supply aligned with stock so admin dashboards stay consistent
      supply: numericStock,
    });

    const saved = await product.save();

    return res.status(201).json({
      success: true,
      product: saved,
    });
  } catch (err) {
    console.error('Failed to create product:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: err.message,
    });
  }
});

// PUT: update an existing product
router.put('/:id', async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body cannot be empty',
      });
    }

    const update = { ...req.body };

    // Normalize numeric fields if provided
    if (update.price !== undefined) {
      update.price = Number(update.price);
    }
    if (update.cost !== undefined) {
      update.cost = Number(update.cost);
    }
    if (update.stock !== undefined) {
      update.stock = Number(update.stock);
      // keep supply in sync when stock is updated
      update.supply = update.stock;
    }
    if (update.reorderLevel !== undefined) {
      update.reorderLevel = Number(update.reorderLevel);
    }
    if (update.prescription !== undefined) {
      update.prescription = Boolean(update.prescription);
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.json({
      success: true,
      product: updated,
    });
  } catch (err) {
    console.error('Failed to update product:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: err.message,
    });
  }
});

// DELETE: remove a product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    console.error('Failed to delete product:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: err.message,
    });
  }
});

export default router;
