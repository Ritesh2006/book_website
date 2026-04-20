const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', 'Backend', '.env') });

const checkUsersNative = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');
        
        const count = await mongoose.connection.db.collection('users').countDocuments();
        console.log('Total users in collection:', count);
        
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        users.forEach(u => console.log(`- ${u.email}`));
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkUsersNative();
