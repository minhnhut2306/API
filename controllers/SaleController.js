const { model } = require("mongoose");
const SaleModel = require('./SaleModel');



// add 
const addSale = async (date, title, discountAmount, discountPercent, minOrderValue, expirationDate, isExpired) => {
    try {
        // Kiểm tra các tham số
        if (!date || !title || typeof discountAmount !== 'number' || typeof discountPercent !== 'number' || 
            typeof minOrderValue !== 'number' || !expirationDate || typeof isExpired !== 'boolean') {
            throw new Error('Vui lòng nhập đầy đủ thông tin khuyến mãi');
        }

        const sale = {
            date,
            title,
            discountAmount,
            discountPercent,
            minOrderValue,
            expirationDate,
            isExpired
        };

        const newSale = new SaleModel(sale);
        const result = await newSale.save();
        return result;
    } catch (error) {
        console.error("Sale error: ", error.message);
        throw new Error("Thêm khuyến mãi thất bại: " + error.message);
    }
};

module.exports = {
    addSale
  };