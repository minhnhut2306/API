// controllers/imagesController.js
const Image = require('../controllers/ImagesModel');
const Video = require('../controllers/VideoModel');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Hàm để upload ảnh
const uploadImage = async (req, res) => {
    try {
        console.log("Request Body:", req.body);      // Logs request body
        console.log("Uploaded File:", req.file);     // Logs uploaded file data

        const imageUrl = req.body.imageUrl || `/uploads/${req.file?.filename}`;
        if (!imageUrl) {
            return res.status(400).json({ message: 'Please provide an image URL or upload a file.' });
        }

        const image = new Image({
            userId: req.body.userId,
            imageUrl: imageUrl
        });

        await image.save();
        res.status(201).json({ message: 'Image uploaded successfully!', image });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: 'Server error occurred', error: error.message || error });
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
    const imageId = req.params.id; // Lấy imageId từ tham số URL
  
    try {
      // Kiểm tra nếu ID ảnh hợp lệ
      const image = await Image.findById(imageId);
      if (!image) {
        return res.status(404).json({ message: 'Không tìm thấy ảnh' });
      }
  
      // Đảm bảo file ảnh tồn tại trước khi cố gắng xóa
      const filePath = path.join(__dirname, '..', image.imageUrl);
  
      try {
        // Kiểm tra xem file có tồn tại không
        await fs.access(filePath);
        
        // Xóa file ảnh khỏi thư mục uploads
        await fs.unlink(filePath);
        console.log('Ảnh đã được xóa khỏi hệ thống');
      } catch (err) {
        console.error('Không thể xóa ảnh khỏi hệ thống', err);
        return res.status(500).json({ message: 'Không thể xóa ảnh khỏi hệ thống', error: err });
      }
  
      // Xóa ảnh khỏi database
      await Image.findByIdAndDelete(imageId);
      res.status(200).json({ message: 'Ảnh đã được xóa' });
  
    } catch (error) {
      console.error('Lỗi khi xóa ảnh:', error);
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


const deleteVideo = async (req, res) => {
    const videoId = req.params.id; // Lấy ID video từ URL
  
    try {
      // Tìm video trong cơ sở dữ liệu
      const video = await Video.findById(videoId); // Thay 'Video' bằng model của bạn
      if (!video) {
        console.error('Video không tìm thấy');
        return res.status(404).json({ message: 'Video không tìm thấy' });
      }
  
      // Tạo đường dẫn đến tệp video
      const filePath = path.join(__dirname, '..', video.videoUrl);
  
      // Kiểm tra xem tệp có tồn tại không
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('Tệp không tồn tại:', err);
          return res.status(404).json({ message: 'Tệp video không tồn tại' });
        }
  
        // Xóa tệp video
        fs.unlink(filePath, async (err) => {
          if (err) {
            console.error('Không thể xóa video:', err);
            return res.status(500).json({ message: 'Không thể xóa video', error: err });
          }
  
          console.log('Video đã được xóa khỏi hệ thống');
  
          try {
            // Xóa video khỏi cơ sở dữ liệu
            await Video.findByIdAndDelete(videoId);
            return res.status(200).json({ message: 'Video đã được xóa thành công' });
          } catch (deleteError) {
            console.error('Lỗi khi xóa video trong cơ sở dữ liệu:', deleteError);
            return res.status(500).json({ message: 'Lỗi khi xóa video trong cơ sở dữ liệu', error: deleteError });
          }
        });
      });
    } catch (error) {
      console.error('Lỗi khi xóa video:', error);
      res.status(500).json({ message: 'Lỗi khi xóa video', error: error });
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
    getUserMedia,
    deleteVideo
};
