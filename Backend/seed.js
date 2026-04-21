const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./src/models/Book');
const Post = require('./src/models/Post');
const connectDB = require('./src/config/db');

dotenv.config();

const mockBooks = [
  { 
    title: "Pride and Prejudice", 
    author: "Jane Austen", 
    category: "Classic", 
    rating: 4.9, 
    coverImage: "https://covers.openlibrary.org/b/id/14312836-L.jpg",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  { 
    title: "The Adventures of Sherlock Holmes", 
    author: "Arthur Conan Doyle", 
    category: "Mystery", 
    rating: 4.8, 
    coverImage: "https://covers.openlibrary.org/b/id/12832264-L.jpg",
    pdfUrl: "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf"
  },
  { 
    title: "Moby-Dick", 
    author: "Herman Melville", 
    category: "Classic", 
    rating: 4.5, 
    coverImage: "https://covers.openlibrary.org/b/id/12660057-L.jpg",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf"
  },
  { 
    title: "Dracula", 
    author: "Bram Stoker", 
    category: "Horror", 
    rating: 4.7, 
    coverImage: "https://covers.openlibrary.org/b/id/14421115-L.jpg",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  { 
    title: "Alice in Wonderland", 
    author: "Lewis Carroll", 
    category: "Fantasy", 
    rating: 4.9, 
    coverImage: "https://covers.openlibrary.org/b/id/14101292-L.jpg",
    pdfUrl: "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf"
  },
  { 
    title: "The Picture of Dorian Gray", 
    author: "Oscar Wilde", 
    category: "Philosophy", 
    rating: 4.6, 
    coverImage: "https://covers.openlibrary.org/b/id/12668541-L.jpg",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf"
  },
  { 
    title: "Wuthering Heights", 
    author: "Emily Brontë", 
    category: "Classic", 
    rating: 4.5, 
    coverImage: "https://covers.openlibrary.org/b/id/10543209-L.jpg",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  { 
    title: "Great Expectations", 
    author: "Charles Dickens", 
    category: "Classic", 
    rating: 4.8, 
    coverImage: "https://covers.openlibrary.org/b/id/12586617-L.jpg",
    pdfUrl: "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf"
  },
  { 
    title: "The Adventures of Tom Sawyer", 
    author: "Mark Twain", 
    category: "Adventure", 
    rating: 4.7, 
    coverImage: "https://covers.openlibrary.org/b/id/12569438-L.jpg",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf"
  },
  { 
    title: "Jane Eyre", 
    author: "Charlotte Brontë", 
    category: "Romance", 
    rating: 4.9, 
    coverImage: "https://covers.openlibrary.org/b/id/12674393-L.jpg",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  { 
    title: "The War of the Worlds", 
    author: "H.G. Wells", 
    category: "Sci-Fi", 
    rating: 4.6, 
    coverImage: "https://covers.openlibrary.org/b/id/12644265-L.jpg",
    pdfUrl: "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-file.pdf"
  },
  { 
    title: "Metamorphosis", 
    author: "Franz Kafka", 
    category: "Philosophy", 
    rating: 4.5, 
    coverImage: "https://covers.openlibrary.org/b/id/13101683-L.jpg",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf"
  }
];

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

const seed = async () => {
    try {
        await connectDB();
        
        await Book.deleteMany({});
        await Post.deleteMany({});
        
        await Book.insertMany(mockBooks);
        await Post.insertMany(samplePosts);
        
        console.log("Database seeded successfully with books and posts!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
