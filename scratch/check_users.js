const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from Backend folder
dotenv.config({ path: path.join(__dirname, '..', 'Backend', '.env') });

const User = require('../Backend/src/models/User.js');

const checkUsers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');
        
        const users = await User.find({});
        console.log('Total users:', users.length);
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkUsers();
