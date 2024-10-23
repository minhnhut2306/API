const { model } = require("mongoose");

const SaleModel = require("./SaleModel");

const getSale = async () => {
  try {
    let query = {};
    const sale = await SaleModel.find(query);
    return sale;
  } catch (error) {
    console.error("Sale error: ", error.message);
    throw new Error("Lấy khuyến mãi thất bại: " + error.message);
  }
};

const getDetailSale = async (id) => {
  try {
    const saleInDB = await SaleModel.findById(id);
    if (!saleInDB) {
      throw new Error("Không tìm thấy khuyến mãi");
    }
    return saleInDB;
  } catch (error) {
    console.error("Sale error: ", error.message);
    throw new Error("Lấy chi tiết khuyến mãi thất bại: " + error.message);
  }
};

const deleteSale = async (id) => {
  try {
    const saleInDB = await SaleModel.findById(id);
    if (!saleInDB) {
      throw new Error("Không tìm thấy khuyến mãi");
    }
    await SaleModel.deleteOne({ _id: id });
    return true;
  } catch (error) {
    console.error("Sale error: ", error.message);
    throw new Error("Xóa khuyến mãi thất bại: " + error.message);
  }
};

// add
const addSale = async (
  date,
  title,
  discountAmount,
  discountPercent,
  minOrderValue,
  expirationDate,
  isExpired
) => {
  try {
    // Kiểm tra các tham số
    if (
      !date ||
      !title ||
      typeof discountAmount !== "number" ||
      typeof discountPercent !== "number" ||
      typeof minOrderValue !== "number" ||
      !expirationDate ||
      typeof isExpired !== "boolean"
    ) {
      throw new Error("Vui lòng nhập đầy đủ thông tin khuyến mãi");
    }

    const sale = {
      date,
      title,
      discountAmount,
      discountPercent,
      minOrderValue,
      expirationDate,
      isExpired,
    };

    const newSale = new SaleModel(sale);
    const result = await newSale.save();
    return result;
  } catch (error) {
    console.error("Sale error: ", error.message);
    throw new Error("Thêm khuyến mãi thất bại: " + error.message);
  }
};

const updateSale = async (
  date,
  title,
  discountAmount,
  discountPercent,
  minOrderValue,
  expirationDate,
  isExpired,
) => {
  try {
  
    const saleInDB = await SaleModel.findById(id);

    if (!saleInDB) {
      throw new Error("Khôngtìm thấy khuyến mãi");
    }

    saleInDB.date = date || saleInDB.date;
    saleInDB.title = title || saleInDB.title;
    saleInDB.discountAmount = discountAmount || saleInDB.discountAmount;
    saleInDB.discountPercent = discountPercent || saleInDB.discountPercent;
    saleInDB.minOrderValue = minOrderValue || saleInDB.minOrderValue;
    saleInDB.expirationDate = expirationDate || saleInDB.expirationDate;
    saleInDB.isExpired = isExpired || saleInDB.isExpired;

    saleInDB.updateSale = Date().now;

    await saleInDB.save();
    return saleInDB;
  } catch (error) {
    console.error("Sale error: ", error.message);
    throw new Error("Sửa khuyến mãi thất bại: " + error.message);
  }
};
module.exports = {
  addSale,
  getSale,
  getDetailSale,
  deleteSale,
  updateSale,
};

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

