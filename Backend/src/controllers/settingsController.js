const Settings = require('../models/Settings');

// @desc    Get a setting by key
// @route   GET /api/settings/:key
// @access  Public
exports.getSetting = async (req, res) => {
    try {
        const setting = await Settings.findOne({ key: req.params.key });
        if (!setting) {
            return res.json({ key: req.params.key, value: '' });
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
        console.log(`Updating setting: ${key} = ${value}`);
        
        const setting = await Settings.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true, runValidators: true }
        );
        
        res.json(setting);
    } catch (err) {
        console.error('Update setting error:', err.message);
        res.status(500).json({ message: err.message });
    }
};
