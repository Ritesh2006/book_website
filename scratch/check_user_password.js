const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', 'Backend', '.env') });

const checkUserPassword = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');
        
        const user = await mongoose.connection.db.collection('users').findOne({ email: 'riteshrakhit2006@gmail.com' });
        if (user) {
            console.log('User email:', user.email);
            console.log('Has password:', !!user.password);
            console.log('Role:', user.role);
        } else {
            console.log('User not found.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkUserPassword();
