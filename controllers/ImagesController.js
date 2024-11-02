// controllers/imagesController.js
const Image = require('../controllers/ImagesModel');
const Video = require('../controllers/VideoModel');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Hàm để upload ảnh
const uploadImage = async (req, res) => {
    try {
        // Kiểm tra xem có URL ảnh hoặc file ảnh trong request không
        const imageUrl = req.body.imageUrl || `/uploads/${req.file?.filename}`;
        
        // Kiểm tra nếu không có cả URL ảnh và file
        if (!imageUrl) {
            return res.status(400).json({ message: 'Bạn phải cung cấp URL ảnh hoặc tải lên một file.' });
        }

        // Tạo một instance của model Image với dữ liệu từ request
        const image = new Image({
            userId: req.body.userId,
            imageUrl: imageUrl // Lưu URL ảnh hoặc đường dẫn file ảnh
        });

        await image.save(); // Lưu vào database
        res.status(201).json({ message: 'Ảnh đã được tải lên thành công!', image });
    } catch (error) {
        console.error("Lỗi khi tải lên ảnh:", error); // In lỗi chi tiết vào console
        res.status(500).json({ message: 'Đã có lỗi xảy ra', error: error.message || error });
    }
};


// Hàm để lấy tất cả ảnh của một người dùng
const getUserImages = async (req, res) => {
    try {
        const images = await Image.find({ userId: req.params.userId });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: 'Không thể lấy ảnh', error });
    }
};

// Hàm để xóa ảnh
const deleteImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Không tìm thấy ảnh' });
        }

        // Xóa file ảnh khỏi thư mục uploads
        const filePath = path.join(__dirname, '..', image.imageUrl);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Không thể xóa ảnh khỏi hệ thống', err);
            }
        });

        // Xóa ảnh khỏi database
        await Image.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Ảnh đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Không thể xóa ảnh', error });
    }
};





// Hàm để upload video
const uploadVideo = async (req, res) => {
    try {
        // Kiểm tra xem có URL video hoặc file video trong request không
        const videoUrl = req.body.videoUrl || `/uploads/${req.file?.filename}`;
        
        // Kiểm tra nếu không có cả URL video và file
        if (!videoUrl) {
            return res.status(400).json({ message: 'Bạn phải cung cấp URL video hoặc tải lên một file.' });
        }

        // Tạo một instance của model Video với dữ liệu từ request
        const video = new Video({
            userId: req.body.userId,
            videoUrl: videoUrl // Lưu URL video hoặc đường dẫn file video
        });

        await video.save(); // Lưu vào database
        res.status(201).json({ message: 'Video đã được tải lên thành công!', video });
    } catch (error) {
        console.error("Lỗi khi tải lên video:", error); // In lỗi chi tiết vào console
        res.status(500).json({ message: 'Đã có lỗi xảy ra', error: error.message || error });
    }
};

// Hàm để lấy tất cả video của một người dùng
const getUserVideos = async (req, res) => {
    try {
        const videos = await Video.find({ userId: req.params.userId });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Không thể lấy video', error });
    }
};


const getUserMedia = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Tìm tất cả ảnh và video của người dùng theo userId
        const images = await Image.find({ userId: userId });
        const videos = await Video.find({ userId: userId });

        // Trả về danh sách ảnh và video
        res.status(200).json({ images, videos });
    } catch (error) {
        res.status(500).json({ message: 'Không thể lấy dữ liệu', error });
    }
};
module.exports = {
    uploadImage,
    getUserImages,
    deleteImage,
    uploadVideo,
    getUserVideos,
    getUserMedia
};
