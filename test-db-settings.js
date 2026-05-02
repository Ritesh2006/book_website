const mongoose = require('mongoose');
const Settings = require('./Backend/src/models/Settings');
require('dotenv').config({ path: './Backend/.env' });

async function testSave() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
        
        const key = 'tourVideoUrl';
        const value = 'https://www.w3schools.com/html/mov_bbb.mp4';
        
        const setting = await Settings.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );
        
        console.log("Saved setting:", setting);
        
        const fetched = await Settings.findOne({ key });
        console.log("Fetched setting:", fetched);
        
        process.exit(0);
    } catch (e) {
        console.error("Test failed:", e.message);
        process.exit(1);
    }
}

testSave();
