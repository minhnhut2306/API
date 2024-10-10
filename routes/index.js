const express = require('express');
const router = express.Router();
// http://localhost:3000/


/**
 * method: GET
 * url: http://localhost:3000/giai-phuong-trinh-bac-2?a=1&b=2&c=10
 */






/**
 * method: GET
 * url: http://localhost:3000/products?a=1&b=2&c=10
 */
// router.get('/products', async (req, res, next) => {
//   try {
//     const { a, b, c, d } = req.query;
//     console.log(a, b, c, d);
//     return res.status(200).json({ message: 'Hoàn thành' });
//   } catch (error) {
//     console.log('Error products get: ', error.message);
//     return res.status(500).json({ message: 'Xem đi' });
//   }
// });




// method: GET
// url: http://localhost:3000/
router.get('/', function (req, res, next) {
  const sinhVien = {
    name: 'Nguyen Van A',
    age: 20,
    address: 'Ha Noi'
  }
  const monHoc = ['Toan', 'Ly', 'Hoa', 'Anh van']
  const result = {
    sinhVien: sinhVien,
    monHoc: monHoc
  }
  return res.status(200).json(result);
});



module.exports = router;