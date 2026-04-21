const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { sendWelcomeEmail, sendLoginAlert } = require('../utils/emailService');
const { isDisposableEmail } = require('../utils/securityUtils');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Secret for JWT (Usually kept in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_bookhaven';

// @route POST /api/users/login
// @route POST /api/users/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (isDisposableEmail(email)) {
            return res.status(400).json({ message: 'Temporary/Disposable emails are not allowed for registration.' });
        }
        
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            picture: name ? name.charAt(0).toUpperCase() : 'U'
        });
        
        console.log(`User created: ${email}`);
        
        // Send welcome email
        sendWelcomeEmail(email, name || 'User').catch(err => console.error('Failed to send welcome email:', err));
        
        return res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: 'Server error during registration' });
    }
});

// @route POST /api/users/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (isDisposableEmail(email)) {
             return res.status(400).json({ message: 'Temporary/Disposable emails are not allowed.' });
        }
        
        console.log(`Login attempt for: ${email}`);
        
        // Check if the user is the specific admin.
        if (email === 'admin@bookhaven.com' && password === 'admin123') {
            const token = jwt.sign({ id: 1, role: 'admin', email }, JWT_SECRET, { expiresIn: '7d' });
            
            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // Always true for cross-domain support
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });
            
            return res.json({ message: 'Logged in as Admin', user: { email, role: 'admin', name: 'Identity Admin' } });
        } 
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        if (!user.password) {
            return res.status(401).json({ message: 'Please login using Google (No password set)' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id, role: user.role, email }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        
        // Send login alert
        sendLoginAlert(email, user.name || 'User').catch(err => console.error('Failed to send login alert:', err));
        
        return res.json({ message: 'Login successful', user: { email: user.email, role: user.role, name: user.name, picture: user.picture } });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: 'Server error during login' });
    }
});

// @route POST /api/users/google-login
router.post('/google-login', async (req, res) => {
    const { token } = req.body;
    
    try {
        // Verification of the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;
 
        // DB Upsert: Save user to DB if they don't exist
        let dbUser = await User.findOne({ email });
        if (!dbUser) {
            dbUser = await User.create({ email, name, picture });
        }
 
        const sessionToken = jwt.sign({ id: dbUser._id, role: dbUser.role, email }, JWT_SECRET, { expiresIn: '7d' });
        
        res.cookie('token', sessionToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Send login alert
        sendLoginAlert(email, dbUser.name || 'User').catch(err => console.error('Failed to send login alert:', err));

        return res.json({ message: 'Google Verification Successful', user: dbUser });
    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(401).json({ message: 'Google token verification failed' });
    }
});

// Middleware to verify session
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// @route GET /api/users/me -> Verifies the JWT session via HttpOnly Cookie
router.get('/me', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Handle hardcoded admin case
        if (decoded.id === 1) {
            return res.json({ 
                user: { 
                    _id: 1, 
                    email: 'admin@bookhaven.com', 
                    role: 'admin', 
                    name: 'Identity Admin',
                    picture: 'A',
                    bio: 'System Administrator',
                    location: 'Global',
                    createdAt: new Date('2026-01-01'), // Fixed date for admin
                    readingProgress: [] 
                } 
            });
        }

        const user = await User.findById(decoded.id).populate('readingProgress.bookId').populate('readingProgress.paperId');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// @route PUT /api/users/profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        if (req.user.id === 1) return res.json({ message: 'Admin profile cannot be modified', user: { name: 'Identity Admin', role: 'admin' } });

        const { name, bio, location, picture } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, bio, location, picture },
            { new: true }
        );
        res.json({ message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// @route POST /api/users/reading-progress
router.post('/reading-progress', verifyToken, async (req, res) => {
    try {
        if (req.user.id === 1) return res.json({ message: 'Progress saved (Simulation)' });

        const { bookId, paperId, progress, status } = req.body;
        const user = await User.findById(req.user.id);
        
        const existing = user.readingProgress.find(p => 
            (bookId && p.bookId?.toString() === bookId) || 
            (paperId && p.paperId?.toString() === paperId)
        );

        if (existing) {
            existing.progress = progress || existing.progress;
            existing.status = status || existing.status;
            existing.lastRead = Date.now();
        } else {
            user.readingProgress.push({ bookId, paperId, progress, status, lastRead: Date.now() });
        }

        await user.save();
        res.json({ message: 'Progress saved', readingProgress: user.readingProgress });
    } catch (err) {
        res.status(500).json({ message: 'Failed to save progress' });
    }
});

// @route POST /api/users/support
router.post('/support', verifyToken, async (req, res) => {
    try {
        const { subject, message } = req.body;
        let userData;

        if (req.user.id === 1) {
            userData = { name: 'Identity Admin', email: 'admin@bookhaven.com' };
        } else {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            userData = { name: user.name, email: user.email };
        }

        const { sendSupportRequest } = require('../utils/emailService');
        await sendSupportRequest({ subject, message }, userData);

        res.json({ message: 'Support request sent! We will contact you soon.' });
    } catch (err) {
        console.error('Support error:', err);
        res.status(500).json({ message: 'Failed to send support request. Mail configuration error.' });
    }
});

// @route DELETE /api/users/delete-account
router.delete('/delete-account', verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete account' });
    }
});

// @route POST /api/users/logout
router.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ message: 'Logged out successfully' });
});

// @route POST /api/users/subscribe
router.post('/subscribe', async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });
        
        await sendWelcomeEmail(email, name || 'Book Lover');
        res.status(200).json({ message: 'Welcome email sent successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process subscription' });
    }
});

// @route GET /api/users (Admin only)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
