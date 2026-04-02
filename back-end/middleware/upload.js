const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Cấu hình Cloudinary bằng các key trong file .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Tạo kho chứa trên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vcrons_products', // Tên thư mục sẽ tạo trên Cloudinary
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'], // Chỉ cho phép đuôi ảnh này
  },
});

const upload = multer({ storage: storage });

module.exports = upload;