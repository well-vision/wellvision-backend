import Product from '../models/productModel.js';

// Get all products with filtering and pagination
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      brand = '',
      stockStatus = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    let filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (brand && brand !== 'all') {
      filter.brand = brand;
    }

    if (stockStatus) {
      switch (stockStatus) {
        case 'in-stock':
          filter.$expr = { $gt: ['$stock', '$reorderLevel'] };
          break;
        case 'low-stock':
          filter.$and = [
            { stock: { $gt: 0 } },
            { $expr: { $lte: ['$stock', '$reorderLevel'] } }
          ];
          break;
        case 'out-of-stock':
          filter.stock = 0;
          break;
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      cost: parseFloat(req.body.cost),
      stock: parseInt(req.body.stock),
      reorderLevel: parseInt(req.body.reorderLevel) || 10
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      product,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      cost: req.body.cost ? parseFloat(req.body.cost) : undefined,
      stock: req.body.stock ? parseInt(req.body.stock) : undefined,
      reorderLevel: req.body.reorderLevel ? parseInt(req.body.reorderLevel) : undefined
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete product (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get product statistics
export const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$stock', '$cost'] } },
          lowStockCount: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', '$reorderLevel'] }] },
                1,
                0
              ]
            }
          },
          outOfStockCount: {
            $sum: {
              $cond: [{ $eq: ['$stock', 0] }, 1, 0]
            }
          },
          inStockCount: {
            $sum: {
              $cond: [{ $gt: ['$stock', '$reorderLevel'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalProducts: 0,
      totalValue: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      inStockCount: 0
    };

    res.status(200).json({
      success: true,
      stats: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Bulk update stock
export const bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, stock }

    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { stock: parseInt(update.stock) }
      }
    }));

    await Product.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
