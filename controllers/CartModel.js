// khai báo 1 schema(model) cho cart
// (_id, name, price, quantity, createAt, updateAt)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const AppConstants = require('../helpers/AppConstants');

    const CartSchema = new Schema({
        user: { type: Object, required: true },
        total: { type: Number, default: 0 },
        products: [{
        _id: { type: Schema.Types.ObjectId, ref: 'products' },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        category_id: { type: Schema.Types.ObjectId, ref: 'categories' }, 
        category_name: { type: String }, 
        images: [{ type: String }], 
        }],
        date: { type: Date, default: Date.now },
    });
    

module.exports = mongoose.models.cart || mongoose.model('cart', CartSchema);