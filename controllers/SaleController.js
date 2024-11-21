const SaleModel = require("./SaleModel");
const { model } = require("mongoose");
// Fetch all sales
const getSale = async () => {
  try {
    let query = {};
    const sales = await SaleModel.find(query);
    return sales;
  } catch (error) {
    console.error("Sale error: ", error.message);
    throw new Error("Lấy khuyến mãi thất bại: " + error.message);
  }
};

// Fetch sale details by ID
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

// Delete sale by ID
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

// Add a new sale
const addSale = async (
  date,
  title,
  discountAmount,
  discountPercent,
  minOrderValue,
  expirationDate,
  // isExpired
) => {
  try {
    // Kiểm tra các tham số
    if (
      !date ||
      !title ||
      typeof discountAmount !== "number" ||
      typeof discountPercent !== "number" ||
      typeof minOrderValue !== "number" 
      // !expirationDate ||
      // typeof isExpired !== "boolean"
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
      // isExpired,
    };

    const newSale = new SaleModel(sale);
    const result = await newSale.save();
    return result;
  } catch (error) {
    console.error("Sale error: ", error.message);
    throw new Error("Thêm khuyến mãi thất bại: " + error.message);
  }
};

// Update an existing sale
const updateSale = async (

  id,
  date,
  title,
  discountAmount,
  discountPercent,
  minOrderValue,
  expirationDate,
  // isExpired
) => {
  try {
    const saleInDB = await SaleModel.findById(id);
    console.log(id);
    if (!saleInDB) {
      throw new Error("Không tìm thấy khuyến mãi");
    }

    // Update fields if new values are provided, otherwise keep the existing ones
    saleInDB.date = date || saleInDB.date;
    saleInDB.title = title || saleInDB.title;
    saleInDB.discountAmount = discountAmount || saleInDB.discountAmount;
    saleInDB.discountPercent = discountPercent || saleInDB.discountPercent;
    saleInDB.minOrderValue = minOrderValue || saleInDB.minOrderValue;
    saleInDB.expirationDate = expirationDate || saleInDB.expirationDate;
    // saleInDB.isExpired = isExpired !== undefined ? isExpired : saleInDB.isExpired; // Update if provided

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
