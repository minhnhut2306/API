var express = require("express");
var router = express.Router();
const userController = require("../controllers/UserController")
const { deleteAccountById } = require("../controllers/UserController");
const mongoose = require("mongoose"); // Nhập mongoose



/* GET 

users listing. */
// tự làm
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Đăng ký tài khoản
 *     description: Đăng ký tài khoản người dùng mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname: 
 *                 type: string
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               password:
 *                 type: string
 *                 example: "your_password"
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       500:
 *         description: Lỗi máy chủ
 */

router.get("/get-NewUsers", async (req, res, next) => {
  try {
    const result = await userController.getNewUsers();
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log("Get NewUsers error:", error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

/* GET users listing. */
router.get("/get-OdlUsers", async (req, res, next) => {
  try {
    const result = await userController.getOldUsers();
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log("Get NewUsers error:", error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

// Register
///////////////////////////////////////////////////////////////////////
//  router.post('/register', (req, res, next) => {
//   const { name, email, password,phone } = req.body;
//   if (!name ||!email ||!password||!phone) {
//     return res.status(400).json({ message: 'Vui lòng nhập đầy đ�� thông tin' });
//   }

//   // thêm người dùng vào database

//   res.status(201).json({ message: 'Đăng ký thành công' });
// });
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;
    const result = await userController.register(email, password, name, phone);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log("Register error:", error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

// SMS
// const sendSMS = async (to, message) => {
//   try {
//     const messageResponse = await client.messages.create({
//       body: message,
//       from: TWILIO_PHONE_NUMBER, // Số điện thoại Twilio của bạn
//       to: to, // Số điện thoại người dùng đăng ký
//     });
//     console.log(`SMS sent: ${messageResponse.sid}`);
//   } catch (error) {
//     console.error("Error sending SMS:", error.message);
//   }
// };

///////////////////////////////////////////////////////////////////
// login

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userController.login(email, password);

    if (result) {
      return res.status(200).json({ status: true, data: result });
    } else {
      return res
        .status(400)
        .json({ status: false, data: "Email hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    console.log("Login error:", error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});
//http://localhost:6677/users/delete-account
router.delete("/delete-account", async (req, res) => {
  try {
    const { userId } = req.body; // Nhận userId từ request body

    // Kiểm tra xem userId có được cung cấp hay không
    if (!userId) {
      return res.status(400).json({
        status: false,
        data: "UserId là bắt buộc",
      });
    }

    // Kiểm tra định dạng của userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: false,
        data: "UserId không hợp lệ",
      });
    }

    // Gọi controller để xóa tài khoản
    const result = await userController.deleteAccountById(userId);

    return res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error) {
    console.error("Delete account error:", error.message);
    return res.status(500).json({
      status: false,
      data: "Xóa tài khoản thất bại: " + error.message,
    });
  }
});

router.put("/:id/updateProfile", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, birthday, bio, gender, avatar } = req.body
    const result = await userController.updateProfile(id, name, birthday, bio, gender, avatar);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log("UpdateProfile error:", error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

router.get("/:id/getProfileApp", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userController.getProfile(id);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log("Get NewUsers error:", error.message);
    return res.status(500).json({ status: false, data: error.message });
  }
});

// <<<<<<< HEAD
// router.post('/addCart_App', async (req, res, next) => {
//   try {
//     const { user, products } = req.body;

//     if (!user || !products) {
//       return res.status(400).json({ status: false, data: "Thiếu user hoặc products" });
//     }

//     const result = await userController.addCart(user, products);
//     return res.status(200).json({ status: true, data: result });
//   } catch (error) {
//     console.error("Add to cart error:", error.message);
//     return res.status(500).json({ status: false, data: error.message });
//   }
// });
// =======
router.post("/:userId/addressNew", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      user,
      houseNumber,
      alley,
      quarter,
      district,
      city,
      country,
    } = req.body;

    if (!user || !user.phone) {
      throw new Error("User data is missing or incomplete");
    }

    const address = await userController.addAddress(
      userId,
      user,
      houseNumber,
      alley,
      quarter,
      district,
      city,
      country
    );
    console.log('thêm thành công address', address);

    return res.status(200).json({
      status: true,
      message: "Address added successfully",
      address,
    });


  } catch (error) {
    console.error("Thêm địa chỉ error:", error.message);
    return res.status(500).json({ status: false, message: error.message });
  }
});


router.get("/getAddress/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userController.getAddress(userId);

    if (!user || user.length === 0) {
      return res.status(404).json({ status: false, message: "No address found for this user" });
    }

    return res.status(200).json({ status: true, data: user });
  } catch (error) {
    console.log("Get address error: ", error.message);
    return res.status(500).json({ status: false, message: error.message });
  }
});


router.post('/change-password', async (req, res) => {
  const { id, password, newPassword } = req.body;

  try {
    const result = await userController.changePassword(id, password, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/getAddressById/:addressId', async (req, res) => {
  const { addressId } = req.params;
  console.log('getAddressById', addressId);

  try {
    const result = await userController.getAddressById(addressId);
    console.log('result', result);
    if (result.status === 200) {
      res.status(200).json(result.data);
    } else {
      res.status(result.status).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error in route getAddressById:', error.message);
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
});
router.put('/updateAddress/:userId/:addressId', async (req, res) => {
  const { userId, addressId } = req.params;
  const { name, phone } = req.body.user;
  const { houseNumber, alley, quarter, district, city, country } = req.body;

  // Log incoming request data
  console.log("Received update request:", { userId, addressId, user: req.body.user });

  try {
    const updatedAddress = await userController.updateAddress(
      userId,
      addressId,
      { name, phone },
      houseNumber,
      alley,
      quarter,
      district,
      city,
      country
    );

    console.log("Updated address from controller:", updatedAddress);
    if (updatedAddress) {
      res.status(200).json({ message: 'Địa chỉ đã được cập nhật', addressId: updatedAddress });
    } else {
      res.status(400).json({ message: 'Lỗi cập nhật địa chỉ' });
    }
  } catch (error) {
    console.error('Update address error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/deleteAddress/:userId/:addressId', async (req, res) => {
  const { userId, addressId } = req.params;

  try {
    const result = await userController.deleteAddress(userId, addressId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.put('/updateUsers/:userId', async (req, res) => {
  const { phone } = req.body;

  const { userId } = req.params
  try {
    const updateUser = await userController.updateUser(
      userId,
      phone

    );

    console.log("Updated address from controller:", updateUser);
    if (updateUser) {
      res.status(200).json({ message: 'User đã được cập nhật', userId: updateUser });
    } else {
      res.status(400).json({ message: 'Lỗi cập nhật User' });
    }
  } catch (error) {
    console.error('Update User error:', error);
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
