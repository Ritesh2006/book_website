const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken, adminOnly } = require('../middleware/auth');

// @route   GET /api/settings/:key
router.get('/:key', settingsController.getSetting);

// @route   POST /api/settings
router.post('/', verifyToken, adminOnly, settingsController.updateSetting);

module.exports = router;
