// controllers/imagesController.js
const Image = require('../controllers/ImagesModel');
const fs = require('fs');
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

module.exports = {
    uploadImage,
    getUserImages,
    deleteImage
};
