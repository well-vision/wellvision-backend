import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['eyeglasses', 'sunglasses', 'contact-lenses', 'lens', 'accessories']
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  reorderLevel: {
    type: Number,
    min: 0,
    default: 10
  },
  description: {
    type: String,
    trim: true
  },
  frameMaterial: {
    type: String,
    trim: true
  },
  frameColor: {
    type: String,
    trim: true
  },
  lensType: {
    type: String,
    trim: true
  },
  prescription: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', brand: 'text', model: 'text' });

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  if (this.price === 0) return 0;
  return ((this.price - this.cost) / this.price) * 100;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock <= this.reorderLevel) return 'low-stock';
  return 'in-stock';
});

const Product = mongoose.model('Product', productSchema);

export default Product;
