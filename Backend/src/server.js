const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Trust proxy for secure cookies in production (e.g. Render/Vercel)
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost',
    'capacitor://localhost',
    'https://book-website-1w7b.vercel.app',
    'https://book-website-ritesh.vercel.app',
    'https://bookwebsite-woad-phi.vercel.app'
];

app.use(cors({ 
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/posts', require('./routes/communityRoutes'));
app.use('/api/papers', require('./routes/paperRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Basic route
app.get('/', (req, res) => {
    res.send('Book Website API is running...');
});

// Connect to Database and Start Server
const startServer = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await connectDB();
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📁 Static files served from: ${path.join(__dirname, '../../uploads')}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        // Don't exit here if we want the server to stay alive for debugging, 
        // but since connectDB calls process.exit(1) on failure, this might not be reached.
    }
};

startServer();
