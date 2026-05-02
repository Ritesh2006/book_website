const Settings = require('../models/Settings');

// @desc    Get a setting by key
// @route   GET /api/settings/:key
// @access  Public
exports.getSetting = async (req, res) => {
    try {
        const setting = await Settings.findOne({ key: req.params.key });
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.json(setting);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update or create a setting
// @route   POST /api/settings
// @access  Private/Admin
exports.updateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;
        
        let setting = await Settings.findOne({ key });
        
        if (setting) {
            setting.value = value;
            await setting.save();
        } else {
            setting = new Settings({ key, value });
            await setting.save();
        }
        
        res.json(setting);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
