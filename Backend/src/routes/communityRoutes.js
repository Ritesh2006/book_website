const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { sendCommunityPostNotification } = require('../utils/emailService');

// @route GET /api/posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route POST /api/posts
router.post('/', async (req, res) => {
    try {
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();
        
        // Send email notification to the author
        if (savedPost.email) {
            sendCommunityPostNotification(savedPost.email, savedPost.user, savedPost.content.substring(0, 30) + '...')
                .catch(err => console.error('Failed to send post notification:', err));
        }
        
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route PATCH /api/posts/:id/like
router.patch('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        // Toggle like (simplified logic: just increment/decrement)
        const isLiked = req.body.isLiked; // We expect frontend to tell us if it's currently liked
        post.likes = isLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
        
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
