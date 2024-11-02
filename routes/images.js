const express = require('express');
const multer = require('multer');
const imagesController = require('../controllers/ImagesController');
const router = express.Router();

// Cấu hình Multer để lưu ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Route để upload ảnh
//http://localhost:6677/images/upload
router.post('/upload', upload.single('image'), imagesController.uploadImage);

// Route để lấy danh sách ảnh của người dùng
//http://localhost:6677/images/user/6718f858985669198ff27cd2
router.get('/user/:userId', imagesController.getUserImages);

// Route để xóa ảnh
//http://localhost:6677/images/67261ebad2422d40077dd210
router.delete('/:id', imagesController.deleteImage);

module.exports = router;
