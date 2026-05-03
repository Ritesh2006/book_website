const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken, adminOnly } = require('../middleware/auth');

const { videoUpload } = require('../utils/cloudinaryConfig');

// @route   GET /api/settings/:key
router.get('/:key', settingsController.getSetting);

// @route   POST /api/settings
router.post('/', verifyToken, adminOnly, settingsController.updateSetting);

// @route   POST /api/settings/upload-video
router.post('/upload-video', verifyToken, adminOnly, videoUpload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({ url: req.file.path });
    } catch (err) {
        res.status(500).json({ message: 'Failed to upload video to Cloudinary' });
    }
});

module.exports = router;
