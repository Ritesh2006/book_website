const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Generic storage for different resource types
const createStorage = (folder, allowedFormats, resourceType = 'auto') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `bookhaven/${folder}`,
      allowed_formats: allowedFormats,
      resource_type: resourceType,
      public_id: (req, file) => {
        const name = file.originalname.split('.')[0].replace(/\s+/g, '_');
        return `${Date.now()}-${name}`;
      }
    },
  });
};

// Specialized Uploaders
const bookUpload = multer({ storage: createStorage('books', ['pdf', 'epub']) });
const imageUpload = multer({ storage: createStorage('covers', ['jpg', 'png', 'jpeg', 'webp']) });
const videoUpload = multer({ storage: createStorage('videos', ['mp4', 'mov', 'avi', 'mkv'], 'video') });

module.exports = {
  cloudinary,
  bookUpload,
  imageUpload,
  videoUpload
};
