const { isValidObjectId, Types } = require("mongoose");
const ProductModel = require("./ProductModel");
const CategoryModel = require("./CategoryModel");
const PreserveModel = require("./PreserveModel");

const UserModel = require("./UserModel");
//________________________________________APP_______________________________________

// Lấy danh sách sản phẩm (HOME)
const getProduct = async () => {
  try {
    let query = {};
    const products = await ProductModel.find(query).sort({ createAt: -1 });
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
      $or: [
        { name: { $regex: key, $options: "i" } },

        { oum: { $regex: key, $options: "i" } }, // Giả sử không cần tìm theo hình ảnh
      ],
    };

    // Lấy danh sách sản phẩm với tất cả các trường cần thiết
    const products = await ProductModel.find(query).select(
      "name price images oum"
    );

    // Thêm giá trị mặc định cho image và oum
    const productsWithDefaults = products.map((product) => ({
      ...product._doc,
      image:
        product.images && product.images.length > 0
          ? product.images[0]
          : "default_image_url", // Lấy hình ảnh đầu tiên hoặc sử dụng hình ảnh mặc định
      oum: product.oum || "Không có trọng lượng", // giá trị mặc định cho oum
    }));

    return productsWithDefaults;
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
      !price ||
      !oum ||
      !preserve ||
      !images
    ) {
      throw new Error("Vui lòng cung cấp đầy đủ thông tin sản phẩm");
    }

    if (quantity <= 0) {
      throw new Error("Số lượng không được nhập dưới 1");
    }
    if (price < 0) {
      throw new Error("Giá tiền không được âm");
    }

    // lấy category theo id
    const categoryInDB = await CategoryModel.findById(category);
    if (!categoryInDB) {
      throw new Error("Danh mục không tồn tại");
    }

    const preserveInDB = await PreserveModel.findById(preserve);
    if (!categoryInDB) {
      throw new Error("oại hàng không tồn tại");
    }

    // tạo object category
    category = {
category_id: categoryInDB._id,
      category_name: categoryInDB.name,
    };

    preserve = {
      preserve_id: preserveInDB._id,
      preserve_name: preserveInDB.name,
    };

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
      description,
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

    if (!preserve) {
      throw new Error("Loại hàng không tồn tại");
    }

    const udtcCategory = await CategoryModel.findById(category);
    // Assign the category object, assuming you're storing the category details
    if (!udtcCategory) {
      throw new Error("Danh mục không tồn tại");
    }
    udtProduct.category = {
      category_id: udtcCategory._id,
      category_name: udtcCategory.name,
    };

    const udtcPreserve = await PreserveModel.findById(preserve);
    if (!udtcPreserve) {
      throw new Error("oại hàng không tồn tại");
    }
    // Assign the category object, assuming you're storing the category details
    udtProduct.preserve = {
      preserve_id: udtcPreserve._id,
      preserve_name: udtcPreserve.name,
    };

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
const getProductsByCategory = async (id) => {
  try {
    console.log("---------------id: ", id);
    let query = {};
    query = {
      ...query,
      "category.category_id": new Types.ObjectId(id),
    };
    console.log(query);
const products = await ProductModel.find(query);
    return products;
  } catch (error) {
    console.log("findProduct error: ", error.message);
    throw new Error("Tìm kiếm sản phẩm không thành công");
  }
};

// quản lí hàng hóa

module.exports = {
  getProduct,
  getProductDetailById_App,
  getTopProductSell_Web,
  findProductsByKey_App,
  deleteProduct,
  addProduct,
  updateProduct,
  getProductsByCategory,
}
