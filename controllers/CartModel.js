const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
}, { _id: false }) 


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
