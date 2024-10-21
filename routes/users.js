var express = require("express");
var router = express.Router();
const userController = require("../controllers/UserController");

/* GET users listing. */
router.get("/get-NewUsers", async (req, res, next) => {
     try {
        const result = await userController.getNewUsers();
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
const sendSMS = async (to, message) => {
  try {
    const messageResponse = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER, // Số điện thoại Twilio của bạn
      to: to, // Số điện thoại người dùng đăng ký
    });
    console.log(`SMS sent: ${messageResponse.sid}`);
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
};

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

module.exports = router;
