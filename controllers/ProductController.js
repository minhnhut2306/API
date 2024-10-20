const { isValidObjectId } = require("mongoose");
const ProductModel = require("./ProductModel");

//________________________________________APP_______________________________________

// Lấy danh sách sản phẩm (HOME)
const getProduct = async () => {
  try {
    let query = {};
    const products = await ProductModel.find(query);
    return products;
  } catch (error) {
    console.log("getProducts error: ", error.message);
    throw new Error("Lấy danh sách sản phẩm lỗi");
  }
};

// Lấy chi tiết sản phẩm
const getProductDetailById_App = async (id) => {
  try {
    const productInDB = await ProductModel.findById(id);
    if (!productInDB) {
      throw new Error("Không tìm thấy sp");
    }
    return productInDB;
  } catch (error) {
    console.log("getProducts error: ", error.message);
    throw new Error("Lấy danh sách sản phẩm lỗi");
  }
};

// Thống kê top 10 sp bán chạy nhiều nhất
const getTopProductSell_Web = async () => {
  try {
    const products = await ProductModel.find({}, "name sold")
      .sort({ sold: -1 })
      .limit(10);
    return products;
  } catch (error) {
    console.log("getTopProduct error: ", error.message);
    throw new Error("Lấy sp lỗi");
  }
};

// Tìm sản phẩm theo từ khóa
const findProductsByKey_App = async (key) => {
  try {
    let query = {
      name: { $regex: key, $options: "i" }, // Tìm kiếm tên sản phẩm theo từ khóa (không phân biệt hoa thường)
    };

    const products = await ProductModel.find(query).select("name price image uom");
    return products;
  } catch (error) {
    console.log("getProducts error: ", error.message);
    throw new Error("Lấy danh sách sản phẩm lỗi");
  }
};

// Xóa sản phẩm theo id
const deleteProduct = async (id) => {
  try {
    const productInDB = await ProductModel.findById(id);
    if (!productInDB) {
      throw new Error("Sản phẩm không tồn tại");
    }
    await ProductModel.deleteOne({ _id: id });
    return true;
  } catch (error) {
    console.log("deleteProduct: ", error);
    throw new Error("Xóa sp lỗi");
  }
};

// Thêm sản phẩm mới
const addProduct = async (name, price, quantity, images, category, description, uom, supplier, fiber, origin, preserve, uses) => {
  try {
    if (!name || !price || !quantity || !images || !description || !category || !uom || !supplier || !fiber || !origin || !preserve || !uses) {
      throw new Error('Vui lòng cung cấp đầy đủ thông tin sản phẩm');
    }

    const product = { name, price, quantity, images, description, category, uom, supplier, fiber, origin, preserve, uses };
    const newProduct = new ProductModel(product);
    const result = await newProduct.save();
    return result;
  } catch (error) {
    console.error('addProduct error: ', error.message);
    throw new Error('Thêm sản phẩm thất bại: ' + error.message);
  }
};

// Cập nhật sản phẩm
const updateProduct = async (id, name, price, quantity, images, description, category, uom, supplier, fiber, origin, preserve, uses, discount) => {
  try {
    const udtProduct = await ProductModel.findById(id);
    if (!udtProduct) {
      throw new Error("Sản phẩm không tồn tại");
    }
    if (!category) {
      throw new Error("Vui lòng chọn danh mục");
    }

    const udtcCategory = await CategoryModel.findById(category);
    if (!udtcCategory) {
      throw new Error("Danh mục không tồn tại");
    }

    category = { category_id: udtcCategory._id, category_name: udtcCategory.name };

    udtProduct.name = name || udtcCategory.name;
    udtProduct.price = price || udtProduct.price;
    udtProduct.quantity = quantity || udtProduct.quantity;
    udtProduct.images = images || udtProduct.images;
    udtProduct.description = description || udtProduct.description;
    udtProduct.category = category || udtProduct.category;
    udtProduct.uom = uom || udtProduct.uom;
    udtProduct.supplier = supplier || udtProduct.supplier;
    udtProduct.fiber = fiber || udtProduct.fiber;
    udtProduct.origin = origin || udtProduct.origin;
    udtProduct.preserve = preserve || udtProduct.preserve;
    udtProduct.uses = uses || udtProduct.uses;
    udtProduct.discount = discount || udtProduct.discount;
    udtProduct.updateProduct = Date.now;

    await udtProduct.save();
    return true;
  } catch (error) {
    console.log("updateProduct error: ", error.message);
    throw new Error("Cập nhập sản phẩm lỗi");
  }
};

module.exports = {
  getProduct,
  getProductDetailById_App,
  getTopProductSell_Web,
  findProductsByKey_App,
  deleteProduct,
  addProduct,
  updateProduct,
};
