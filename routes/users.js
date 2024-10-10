var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Register
 router.post('/register', (req, res, next) => {
  const { name, email, password,phone } = req.body;
  if (!name ||!email ||!password||!phone) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đ�� thông tin' });
  }

  // thêm người dùng vào database

  res.status(201).json({ message: 'Đăng ký thành công' });
});
module.exports = router;
