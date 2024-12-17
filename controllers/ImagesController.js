// controllers/imagesController.js
const Image = require('../controllers/ImagesModel');
const Video = require('../controllers/VideoModel');
const fs = require('fs').promises;
const multer = require('multer');
const path = require('path');
const { promisify } = require('util');
const access = promisify(fs.access);  // Đảm bảo promisify được thực hiện đúng.
const unlink = promisify(fs.unlink);  // Đảm bảo promisify được thực hiện đúng.

// Hàm để upload ảnh
const uploadImage = async (req, res) => {
    try {
        console.log("Request Body:", req.body);      // Logs request body
        console.log("Uploaded File:", req.file);     // Logs uploaded file data

        const imageUrl = req.body.imageUrl || `/uploads/${req.file?.filename}`;
        if (!imageUrl) {
            return res.status(400).json({ message: 'Hãy nhập url của ảnh hoặc tải ảnh lên ' });
        }

        const image = new Image({
            userId: req.body.userId,
            imageUrl: imageUrl
        });

        await image.save();

        // Trả về thông tin hình ảnh đã tải lên
        res.status(201).json({ message: 'Tải ảnh lên thành công', image });
    } catch (error) {
        console.error("Xảy ra lỗi khi tải ảnh", error);
        res.status(500).json({ message: 'Lỗi tải ảnh', error: error.message || error });
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
  const imageId = req.params.id;

  try {
      // Kiểm tra nếu ID ảnh hợp lệ
      const image = await Image.findById(imageId);
      if (!image) {
          return res.status(404).json({ message: 'Không tìm thấy ảnh' });
      }

      // Kiểm tra nếu imageUrl tồn tại và có giá trị hợp lệ
      if (image.imageUrl) {
          if (image.imageUrl.startsWith('http')) {
              // Xử lý xóa nếu URL là từ dịch vụ lưu trữ bên ngoài (như Cloudinary)
              const publicId = image.imageUrl.split('/').slice(-1)[0].split('.')[0];
              try {
                  await cloudinary.uploader.destroy(publicId);
                  console.log('Ảnh đã được xóa khỏi Cloudinary');
              } catch (err) {
                  console.error('Lỗi khi xóa ảnh khỏi Cloudinary:', err);
                  return res.status(500).json({ message: 'Lỗi khi xóa ảnh từ Cloudinary', error: err.message });
              }
          } else {
              // Xử lý nếu là file cục bộ
              const filePath = path.join(__dirname, '..', image.imageUrl);
              try {
                  await fs.access(filePath); // Kiểm tra xem file có tồn tại không
                  await fs.unlink(filePath); // Xóa file khỏi hệ thống
                  console.log('Ảnh đã được xóa khỏi hệ thống tệp cục bộ');
              } catch (err) {
                  if (err.code === 'ENOENT') {
                      console.warn('Tệp không tồn tại, không cần xóa');
                  } else {
                      console.error('Lỗi khi xóa ảnh khỏi hệ thống tệp cục bộ:', err);
                      return res.status(500).json({ message: 'Không thể xóa ảnh khỏi hệ thống tệp cục bộ', error: err.message });
                  }
              }
          }
      } else {
          console.warn('Không tìm thấy imageUrl hợp lệ để xóa');
      }

      // Xóa ảnh khỏi database
      await Image.findByIdAndDelete(imageId);
      res.status(200).json({ message: 'Ảnh đã được xóa thành công' });

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
      const video = await Video.findById(videoId);
      if (!video) {
          console.error('Video không tìm thấy');
          return res.status(404).json({ message: 'Video không tìm thấy' });
      }

      // Kiểm tra nếu videoUrl tồn tại và không phải undefined
      if (video.videoUrl) {
          if (video.videoUrl.startsWith('http')) {
              // Nếu videoUrl là URL từ dịch vụ bên ngoài, bỏ qua kiểm tra tệp cục bộ
              const publicId = video.videoUrl.split('/').slice(-1)[0].split('.')[0];
              try {
                  // Xóa video từ Cloudinary (hoặc dịch vụ khác)
                  await cloudinary.uploader.destroy(publicId);
                  console.log('Video đã được xóa khỏi Cloudinary');
              } catch (err) {
                  console.error('Lỗi khi xóa video khỏi Cloudinary:', err);
                  return res.status(500).json({ message: 'Lỗi khi xóa video từ Cloudinary', error: err.message });
              }
          } else {
              // Nếu videoUrl là đường dẫn tệp cục bộ
              const filePath = path.join(__dirname, '..', video.videoUrl);

              try {
                  // Kiểm tra sự tồn tại của tệp
                  await fs.access(filePath, fs.constants.F_OK); // Kiểm tra file có tồn tại không
                  await fs.unlink(filePath); // Xóa tệp nếu tồn tại
                  console.log('Video đã được xóa khỏi hệ thống tệp cục bộ');
              } catch (err) {
                  if (err.code === 'ENOENT') {
                      console.warn('Tệp video không tồn tại, bỏ qua bước xóa');
                  } else {
                      console.error('Không thể xóa video khỏi hệ thống tệp cục bộ:', err);
                      return res.status(500).json({ message: 'Không thể xóa video khỏi hệ thống tệp cục bộ', error: err.message });
                  }
              }
          }
      } else {
          console.warn('Không tìm thấy videoUrl hợp lệ để xóa');
      }

      // Xóa video khỏi cơ sở dữ liệu
      await Video.findByIdAndDelete(videoId);
      res.status(200).json({ message: 'Video đã được xóa thành công' });

  } catch (error) {
      console.error('Lỗi khi xóa video:', error);
      res.status(500).json({ message: 'Lỗi khi xóa video', error });
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
