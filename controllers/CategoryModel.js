// khai báo 1 schema cho users
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
});
// tiếng anh, số ít, chữ thường, không dấu, không cách
module.exports = mongoose.models.category || mongoose.model('category', CategorySchema);