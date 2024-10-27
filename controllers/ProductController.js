const { isValidObjectId , Types} = require("mongoose");
const ProductModel = require("./ProductModel");
const CategoryModel = require("./CategoryModel");
const PreserveModel = require("./PreserveModel");

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

    const products = await ProductModel.find(query).select(
      "name price image uom"
    );
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
const addProduct = async (
  name,
  category,
  quantity,
  origin,
  price,
  fiber,
  oum,
  preserve,
  supplier,
  uses,
  images,
  description
) => {
  try {
    if (
      !name ||
      !category ||
      !quantity ||
      !origin ||
      !price ||
      !fiber ||
      !oum ||
      !preserve ||
      !supplier ||
      !uses ||
      !images ||
      !description
    ) {
      throw new Error("Vui lòng cung cấp đầy đủ thông tin sản phẩm");
    }

    const product = {
      name,
      category,
      quantity,
      origin,
      price,
      fiber,
      oum,
      preserve,
      supplier,
      uses,
      images,
      description
    };
    const newProduct = new ProductModel(product);
    const result = await newProduct.save();
    return result;
  } catch (error) {
    console.error("addProduct error: ", error.message);
    throw new Error("Thêm sản phẩm thất bại: " + error.message);
  }
};

// Cập nhật sản phẩm
const updateProduct = async (
  id,
  name,
  category,
  quantity,
  origin,
  price,
  fiber,
  oum,
  preserve,
  supplier,
  uses,
  images,
  description
) => {
  try {
    // Find the product by its ID
    const udtProduct = await ProductModel.findById(id);
    if (!udtProduct) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // Validate the category if provided
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }
    const udtcCategory = await CategoryModel.findById(category);
    // Assign the category object, assuming you're storing the category details
    if (!udtcCategory) {

      throw new Error("Danh mục không tồn tại");
    }
    udtProduct.category = {
      category_id: udtcCategory._id,
      category_name: udtcCategory.name
    };


    if (preserve) {
      const udtcpreserve = await PreserveModel.findById(preserve);
      if (!udtcpreserve) {
        throw new Error("Danh mục không tồn tại");
      }

      // Assign the category object, assuming you're storing the category details
      udtProduct.preserve = {
        _id: udtcpreserve._id,
        preserve_name: udtcpreserve.name
      };

    }

    // Update the product fields if provided
    udtProduct.name = name || udtProduct.name;
    udtProduct.price = price || udtProduct.price;
    udtProduct.quantity = quantity || udtProduct.quantity;
    udtProduct.images = images || udtProduct.images;
    udtProduct.description = description || udtProduct.description;
    udtProduct.oum = oum || udtProduct.oum;
    udtProduct.supplier = supplier || udtProduct.supplier;
    udtProduct.origin = origin || udtProduct.origin;
    udtProduct.fiber = fiber || udtProduct.fiber;
    udtProduct.uses = uses || udtProduct.uses;


    // Set the updated date (corrected)
    udtProduct.updateProduct = Date.now();

    // Save the updated product
    await udtProduct.save();
    return udtProduct; // Return the updated product instead of just true
  } catch (error) {
    console.log("updateProduct error: ", error.message);
    throw new Error(`Cập nhập sản phẩm lỗi: ${error.message}`);
  }
};
// lọc sản phẩm theo danh mục
const getProductsByCategory = async (id) => {
  try {
      console.log('---------------id: ', id);
      let query = {};
       query = {
        'category.category_id': new Types.ObjectId(id) // Sửa thành ObjectId
    };
      console.log(query);
      const products = await ProductModel.find(query);
      return products;
  } catch (error) {
      console.log('findProduct error: ', error.message);
      throw new Error('Tìm kiếm sản phẩm không thành công');
  }
}

module.exports = {
  getProduct,
  getProductDetailById_App,
  getTopProductSell_Web,
  findProductsByKey_App,
  deleteProduct,
  addProduct,
  updateProduct,
  getProductsByCategory,
};
