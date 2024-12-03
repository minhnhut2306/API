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
  isExpired
) => {
  try {
    // Kiểm tra các tham số cơ bản
    if (
      !date ||
      !title ||
      typeof minOrderValue !== "number" ||
      !expirationDate ||
      typeof isExpired !== "boolean"
    ) {
      throw new Error("Vui lòng nhập đầy đủ thông tin khuyến mãi");
    }

    // Kiểm tra logic chỉ được nhập 1 trong 2: discountAmount hoặc discountPercent
    if (
      (typeof discountAmount === "number" && discountAmount > 0 &&
        (typeof discountPercent === "number" && discountPercent > 0)) ||
      (discountAmount <= 0 && discountPercent <= 0)
    ) {
      throw new Error(
        "Chỉ được phép nhập giảm giá theo số tiền cố định hoặc phần trăm, không được nhập cả hai hoặc không nhập giá trị hợp lệ"
      );
    }

    if(discountPercent > 100){
      throw new Error("chỉ được phép nhập tối đa 100");
    }

    // Tạo đối tượng khuyến mãi
    const sale = {
      date,
      title,
      discountAmount: discountAmount > 0 ? discountAmount : 0,
      discountPercent: discountPercent > 0 ? discountPercent : 0,
      minOrderValue,
      expirationDate,
      isExpired,
    };

    // Lưu khuyến mãi
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
  isExpired
) => {
  try {
    const saleInDB = await SaleModel.findById(id);
    console.log(id);
    
    if (!saleInDB) {
      throw new Error("Không tìm thấy khuyến mãi");
    }

    // Kiểm tra logic nếu discountAmount và discountPercent đều có giá trị khác 0
    if (
      (discountAmount && discountPercent) &&
      (discountAmount > 0 || discountPercent > 0)
    ) {
      throw new Error("Chỉ được phép nhập một trong hai: giảm theo số tiền cố định hoặc giảm theo phần trăm, không thể nhập cả hai.");
    }

    // Nếu discountAmount được cập nhật mà discountPercent là 0 thì tiếp tục cho phép
    if (discountAmount && discountAmount > 0 && discountPercent === 0) {
      saleInDB.discountAmount = discountAmount;
    }

    // Nếu discountPercent được cập nhật mà discountAmount là 0 thì tiếp tục cho phép
    if (discountPercent && discountPercent > 0 && discountAmount === 0) {
      saleInDB.discountPercent = discountPercent;
    }

    // Cập nhật các giá trị khác nếu có
    saleInDB.date = date || saleInDB.date;
    saleInDB.title = title || saleInDB.title;
    saleInDB.minOrderValue = minOrderValue || saleInDB.minOrderValue;
    saleInDB.expirationDate = expirationDate || saleInDB.expirationDate;
    saleInDB.isExpired = isExpired !== undefined ? isExpired : saleInDB.isExpired;

    // Lưu lại bản ghi đã cập nhật
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
