const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const cookieParser = require('cookie-parser');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/posts', require('./routes/communityRoutes'));

// Basic route
app.get('/', (req, res) => {
    res.send('Book Website API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
