const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    category: {
      category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
      category_name: { type: String, required: true }
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    images: { type: [String], default: [] },
    discount: { type: Number, default: 0 }
  });

const CartSchema = new Schema({
  user: {
    type: Schema.Types.Mixed,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  products: {
    type: [ProductSchema], 
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Number,
    default: 1, 
  },
}, { timestamps: true }); 

module.exports = mongoose.models.cart || mongoose.model('Cart', CartSchema);
