const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./src/models/Post');
const connectDB = require('./src/config/db');

dotenv.config();

const seedPosts = async () => {
    try {
        await connectDB();
        
        await Post.deleteMany({});
        
        const samplePosts = [
            {
                user: "Alice Reader",
                avatar: "AR",
                content: "Just finished 'Dune' and I am completely blown away by the world-building! Does anyone have recommendations for similar epic sci-fi series?",
                tags: ["SciFi", "Dune", "Recommendations", "MustRead"],
                time: "2 hours ago",
                likes: 42,
                comments: 12
            },
            {
                user: "BookWorm99",
                avatar: "BW",
                content: "Hot take: The Great Gatsby is overrated. The characters are completely unlikable and the plot feels very thin. Change my mind! 🤔",
                tags: ["Classics", "HotTake", "Discussion", "Literature"],
                time: "5 hours ago",
                likes: 89,
                comments: 64
            },
            {
                user: "LitNerd",
                avatar: "LN",
                content: "Started reading 'Atomic Habits' today. I'm only on chapter 3 but the 1% improvement rule has already changed how I look at my daily routine. Highly recommend for self improvement!",
                tags: ["NonFiction", "SelfHelp", "Productivity", "AtomicHabits"],
                time: "1 day ago",
                likes: 156,
                comments: 23
            }
        ];

        await Post.insertMany(samplePosts);
        console.log("Database seeded successfully!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedPosts();
