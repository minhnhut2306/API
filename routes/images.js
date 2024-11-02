// routes/ImagesRoute.js
const express = require('express');
const multer = require('multer');
const imagesController = require('../controllers/ImagesController');
const router = express.Router();

// Cấu hình Multer để lưu video
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
router.post('/upload', upload.single('image'), imagesController.uploadImage);

// Route để upload video
// http://localhost:6677/images/uploadVideo
router.post('/uploadVideo', upload.single('video'), imagesController.uploadVideo);

// Route để lấy danh sách ảnh của người dùng
router.get('/user/:userId', imagesController.getUserImages);

// Route để lấy danh sách video của người dùng
// http://localhost:6677/images/user/:userId/videos
router.get('/user/:userId/videos', imagesController.getUserVideos);

// Route để xóa ảnh
router.delete('/:id', imagesController.deleteImage);

// Route để lấy danh sách ảnh và video của người dùng
// http://localhost:6677/images/media/6718f858985669198ff27cd2
router.get('/media/:userId', imagesController.getUserMedia);

module.exports = router;
