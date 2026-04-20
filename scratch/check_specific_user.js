const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', 'Backend', '.env') });

const User = require('../Backend/src/models/User.js');

const checkSpecificUser = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');
        
        const user = await User.findOne({ email: 'riteshrakhit2006@gmail.com' });
        if (user) {
            console.log('User found:', user);
        } else {
            console.log('User not found.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkSpecificUser();
