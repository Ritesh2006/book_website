const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Improved Storage for Documents (PDFs)
const bookStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookhaven/books',
    resource_type: 'raw', // Use 'raw' for PDFs to avoid conversion issues
    public_id: (req, file) => {
      const name = file.originalname.split('.')[0].replace(/\s+/g, '_');
      return `${Date.now()}-${name}`;
    }
  },
});

// Improved Storage for Images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookhaven/covers',
    resource_type: 'image',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, crop: 'limit' }] // Optimize images on upload
  },
});

// Improved Storage for Videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookhaven/videos',
    resource_type: 'video',
    chunk_size: 6000000, // Handle larger videos
  },
});

const bookUpload = multer({ 
  storage: bookStorage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

const imageUpload = multer({ 
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const videoUpload = multer({ 
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

module.exports = {
  cloudinary,
  bookUpload,
  imageUpload,
  videoUpload
};
