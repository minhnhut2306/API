// khai báo 1 schema cho users
// (_id, email, password, name, role, carts, createdAt, updatedAt, available)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AddressSchema = new Schema({
  user: {
      userId: {type: Schema.Types.ObjectId, 
        ref: 'users',
        required: true,},
      name: { type: String, required: true }, 
      phone: { type: String, required: true },
  },
  houseNumber: { type: String, required: true },
  alley: { type: String, required: true },
  quarter: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = AddressSchema;