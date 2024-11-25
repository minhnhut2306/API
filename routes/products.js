var express = require("express");
var router = express.Router();
const validation = require("../middlewares/Validation");
const ProductController = require("../controllers/ProductController");

// ____________________________Lấy sp home_______________________
// http://localhost:6677/products/getProducts_App
router.get("/getProducts", async (req, res) => {
  try {
    const products = await ProductController.getProduct();
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});
// =================================================================================================================

// lấy sp chi tiết theo id
router.get("/getProductDetailById_App/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductController.getProductDetailById_App(id);
    return res.status(200).json({ success: true, products: product });
  } catch (error) {
    return res.status(500).json({ success: false, products: error.msesage });
  }
});
// =================================================================================================================

// Lấy top 10 sp bán chạy nhất trong app

// router.get("/getTop10PW", async (req, res, next) => {
//   try {
//     const { week, year } = req.query;
//     const products = await ProductController.getTop10PW( week, year );
//     return res.status(200).json({ status: true, data: products });
//   } catch (error) {
//     return res.status(500).json({ status: false, data: error.message });
//   }
// });

router.get("/getTop10PW", async (req, res, next) => {
  try {
    const { date } = req.query; // Nhận ngày từ query string
    const products = await ProductController.getTop10PW(date); // Truyền ngày vào hàm
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

router.get("/getTopProductSell", async (req, res, next) => {
  try {
    const products = await ProductController.getTopProductSell_Web();
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});
// =================================================================================================================

//  __________________________________searech____________________________________--
//http://localhost:6677/products/search?key=coca
// Tìm kiến sản phẩm theo từ khóa (SEARCH)
router.get("/search", async (req, res, next) => {
  try {
    const { key } = req.query;
    // console.log('dfshdjbvhd', key);
    const products = await ProductController.findProductsByKey_App(key);
    console.log(products);
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    console.log("Tìm kiếm sản phẩm thất bại");
    return res.status(500).json({ status: false, data: error.message });
  }
});
// =================================================================================================================
// thêm sản phẩm

// xóa sp theo id
router.delete("/:id/delete", async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await ProductController.deleteProduct(id);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, data: error.massage });
  }
});

router.get("/filter/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("..............id: ", id);
    const products = await ProductController.getProductsByCategory(id);
    console.log("..............product: ", products);
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    console.log("Lấy danh sách sản phẩm thất bại");
    return res.status(500).json({ status: false, data: error.message });
  }
});

router.post("/addSP", [validation.validateProduct], async (req, res, next) => {
  try {
    const {
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
      discount
    } = req.body;
    const product = await ProductController.addProduct(
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
      discount
    );

    return res.status(200).json({ status: true, data: product });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

///////////////////////

// update sp

router.put(
  "/:id/update",
  [validation.validateProduct],
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const {
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
      } = req.body;
      // console.log('---------->' + req.body + "   " + category)
      const product = await ProductController.updateProduct(
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
      );

      return res.status(200).json({ status: true, data: product });
    } catch (error) {
      return res.status(500).json({ status: false, data: error.message });
    }
  }
);

// router.post("/:productId/commentProduct", async (req, res, next) => {
//   try {
//     const { productId } = req.params;
//     const { user, rating, comment, images, videos, displayName } = req.body;

//     const comments = await ProductController.commentProduct(
//       productId,
//       user,
//       rating,
//       comment,
//       images,
//       videos,
//       displayName
//     );

//     return res.status(200).json({ status: true, data: comments });
//   } catch (error) {
//     console.error("Thêm bình luận error:", error.message); // Sửa thành error.message
//     return res.status(500).json({ status: false, data: error.message }); // Sửa thành error.message
//   }
// });
// router.get('category/:id/GetProduct', async (req, res, next) => {
//   try {
//       const { id } = req.query;
//       console.log('..............id: ', id);
//       const products = await ProductController.getProductsByCategory(id);
//       console.log('..............product: ', products);
//       return res.status(200).json({ status: true, data: products })
//   } catch (error) {
//       console.log('Lấy danh sách sản phẩm thất bại');
//       return res.status(500).json({ status: false, data: error.message });
//   }
// });

// id,
// name,
// price,
// quantity,
// images,
// description,
// category,
// oum,
// supplier,
// fiber,
// origin,
// preserve,
// Uses,
// discount

module.exports = router;
