var express = require("express");
var router = express.Router();

const AddressController = require("../controllers/AddressController");

/**
 * lấy ds tất cả danh mục
 * method: get
 * url: http://localhost:6677/categories
 * trả về:
 */
router.get("/", async (req, res, next) => {
  try {
    const address = await AddressController.getAddress();
    return res.status(200).json({ status: true, data: address });
  } catch (error) {
    console.log("Get address error: ", error.massage);
    return res.status(500).json({ status: false, data: error.massage });
  }
});

router.post("/addAddress", async (req, res, next) => {
  try {

    const {userId, houseNumber, alley, quarter, district, city, country } = req.body;

    // Giả sử AddressController được sử dụng để thêm địa chỉ mới
    const result = await AddressController.addAddress(
      userId,

      houseNumber,
      alley,
      quarter,
      district,
      city,
      country
    );

    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});
router.delete("/:id/deleteAddress", async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await AddressController.deleteAddress(id);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, data: error.massage });
  }
});
// Endpoint để lấy tất cả địa chỉ của người dùng
router.get("/getAddresses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm user trong cơ sở dữ liệu
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "Không tìm thấy user" });
    }

    // Trả về danh sách địa chỉ của user
    return res.status(200).json({ status: true, addresses: user.address });
  } catch (error) {
    console.error("Error fetching addresses: ", error.message);
    return res.status(500).json({ status: false, message: "Lỗi khi lấy địa chỉ" });
  }
});
router.post('/addAddresses', async (req, res) => {
  try {
    const { userId, addresses } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!userId || !Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ status: false, message: "Dữ liệu không hợp lệ" });
    }

    // Gọi hàm thêm địa chỉ trong AddressController
    const result = await AddressController.addAddressesText(userId, addresses);

    return res.status(200).json({ status: true, message: "Thêm địa chỉ thành công", data: result });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi khi thêm địa chỉ", error: error.message });
  }
});

module.exports = router;