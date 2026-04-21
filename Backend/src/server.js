const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const cookieParser = require('cookie-parser');

const app = express();

// Connect to Database
connectDB();

app.set('trust proxy', 1);

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'https://book-website-1w7b.vercel.app',
    'https://book-website-ritesh.vercel.app' // Optional fallback
];

app.use(cors({ 
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
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

// Basic route
app.get('/', (req, res) => {
    res.send('Book Website API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
