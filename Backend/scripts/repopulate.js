const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const Book = require('../src/models/Book');

async function populate() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected.");

        console.log("Removing all current books...");
        await Book.deleteMany({});
        console.log("Cleared.");

        console.log("Fetching 100 high-knowledge books from Internet Archive...");
        // Query for classic literature and popular science
        const query = 'mediatype:texts AND (subject:"Classic Literature" OR subject:"Philosophy" OR subject:"Science")';
        const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=description&fl[]=subject&fl[]=date&rows=100&sort[]=downloads+desc&output=json`;

        const response = await axios.get(url);
        const docs = response.data.response.docs;

        console.log(`Found ${docs.length} books. Processing...`);

        const categories = ['Philosophy', 'Science', 'Classic', 'History', 'Literature'];

        const books = docs.map((doc, index) => {
            const identifier = doc.identifier;
            // IA PDF URL pattern: https://archive.org/download/identifier/identifier.pdf
            const pdfUrl = `https://archive.org/download/${identifier}/${identifier}.pdf`;
            // IA Cover URL pattern: https://archive.org/services/img/identifier
            const coverImage = `https://archive.org/services/img/${identifier}`;
            
            // Pick a category based on index or subject
            let category = 'Knowledge';
            if (doc.subject) {
                const sub = doc.subject.toString().toLowerCase();
                if (sub.includes('philosophy')) category = 'Philosophy';
                else if (sub.includes('science')) category = 'Science';
                else if (sub.includes('history')) category = 'History';
                else category = 'Classic';
            }

            return {
                title: doc.title || 'Untitled Knowledge',
                author: doc.creator || 'Unknown Expert',
                description: doc.description ? doc.description.substring(0, 500).replace(/<[^>]*>?/gm, '') : 'Deep dive into essential knowledge and foundational concepts.',
                coverImage: coverImage,
                pdfUrl: pdfUrl,
                category: category,
                price: 0,
                rating: 4.5 + (Math.random() * 0.5),
                pages: 100 + Math.floor(Math.random() * 400),
                publishedDate: doc.date ? doc.date.substring(0, 4) : 'N/A'
            };
        });

        console.log("Inserting into database...");
        await Book.insertMany(books);
        console.log("✅ Successfully added 100 high-knowledge books!");
        
        process.exit(0);
    } catch (err) {
        console.error("❌ Population failed:", err.message);
        process.exit(1);
    }
}

populate();
