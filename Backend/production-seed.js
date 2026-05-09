const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./src/models/Book');
const connectDB = require('./src/config/db');

dotenv.config();

const realBooks = [
  {
    "title": "The Oedipus tyrannus of Sophocles",
    "author": "Sophocles",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/oedipustyrannuso00sophiala",
    "pdfUrl": "https://archive.org/download/oedipustyrannuso00sophiala/oedipustyrannuso00sophiala.pdf"
  },
  {
    "title": "A general introduction to psychoanalysis",
    "author": "Sigmund Freud",
    "category": "Philosophy",
    "rating": 4.7,
    "coverImage": "https://archive.org/services/img/generalintroduct00freuiala",
    "pdfUrl": "https://archive.org/download/generalintroduct00freuiala/generalintroduct00freuiala.pdf"
  },
  {
    "title": "Walden: or, Life in the woods",
    "author": "Henry David Thoreau",
    "category": "Philosophy",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/waldenlifewoods00thorrich",
    "pdfUrl": "https://archive.org/download/waldenlifewoods00thorrich/waldenlifewoods00thorrich.pdf"
  },
  {
    "title": "The Origin of Species",
    "author": "Charles Darwin",
    "category": "Science",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/originofspecies00darwuoft",
    "pdfUrl": "https://archive.org/download/originofspecies00darwuoft/originofspecies00darwuoft.pdf"
  },
  {
    "title": "The Autobiography of Benjamin Franklin",
    "author": "Benjamin Franklin",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/autobiography00franrich",
    "pdfUrl": "https://archive.org/download/autobiography00franrich/autobiography00franrich.pdf"
  },
  {
    "title": "Confessions of St. Augustine",
    "author": "Saint Augustine",
    "category": "Philosophy",
    "rating": 4.7,
    "coverImage": "https://archive.org/services/img/confessionsofst00augurich",
    "pdfUrl": "https://archive.org/download/confessionsofst00augurich/confessionsofst00augurich.pdf"
  },
  {
    "title": "The Odyssey of Homer",
    "author": "Homer",
    "category": "Adventure",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/odyssey00homerich",
    "pdfUrl": "https://archive.org/download/odyssey00homerich/odyssey00homerich.pdf"
  },
  {
    "title": "The Divine Comedy",
    "author": "Dante Alighieri",
    "category": "Classic",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/divinecomedy00dantuoft",
    "pdfUrl": "https://archive.org/download/divinecomedy00dantuoft/divinecomedy00dantuoft.pdf"
  },
  {
    "title": "Paradise Lost",
    "author": "John Milton",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/paradiselost00miltuoft",
    "pdfUrl": "https://archive.org/download/paradiselost00miltuoft/paradiselost00miltuoft.pdf"
  },
  {
    "title": "Faust",
    "author": "Johann Wolfgang von Goethe",
    "category": "Classic",
    "rating": 4.7,
    "coverImage": "https://archive.org/services/img/faust00goetuoft",
    "pdfUrl": "https://archive.org/download/faust00goetuoft/faust00goetuoft.pdf"
  },
  {
    "title": "The Wealth of Nations",
    "author": "Adam Smith",
    "category": "Philosophy",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/wealthofnations00smituoft",
    "pdfUrl": "https://archive.org/download/wealthofnations00smituoft/wealthofnations00smituoft.pdf"
  },
  {
    "title": "Meditations",
    "author": "Marcus Aurelius",
    "category": "Philosophy",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/meditations00marc",
    "pdfUrl": "https://archive.org/download/meditations00marc/meditations00marc.pdf"
  },
  {
    "title": "The Prince",
    "author": "Niccolò Machiavelli",
    "category": "Philosophy",
    "rating": 4.6,
    "coverImage": "https://archive.org/services/img/prince00machuoft",
    "pdfUrl": "https://archive.org/download/prince00machuoft/prince00machuoft.pdf"
  },
  {
    "title": "Frankenstein",
    "author": "Mary Shelley",
    "category": "Horror",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/frankensteinor00shel",
    "pdfUrl": "https://archive.org/download/frankensteinor00shel/frankensteinor00shel.pdf"
  },
  {
    "title": "Dracula",
    "author": "Bram Stoker",
    "category": "Horror",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/dracula00stok",
    "pdfUrl": "https://archive.org/download/dracula00stok/dracula00stok.pdf"
  },
  {
    "title": "Common Sense",
    "author": "Thomas Paine",
    "category": "Philosophy",
    "rating": 4.7,
    "coverImage": "https://archive.org/services/img/commonsense00painiala",
    "pdfUrl": "https://archive.org/download/commonsense00painiala/commonsense00painiala.pdf"
  },
  {
    "title": "Grimms' Fairy Tales",
    "author": "Jacob and Wilhelm Grimm",
    "category": "Fantasy",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/grimmsfairytales00grim",
    "pdfUrl": "https://archive.org/download/grimmsfairytales00grim/grimmsfairytales00grim.pdf"
  },
  {
    "title": "Gulliver's Travels",
    "author": "Jonathan Swift",
    "category": "Adventure",
    "rating": 4.6,
    "coverImage": "https://archive.org/services/img/gulliverstravels00swif",
    "pdfUrl": "https://archive.org/download/gulliverstravels00swif/gulliverstravels00swif.pdf"
  },
  {
    "title": "Robinson Crusoe",
    "author": "Daniel Defoe",
    "category": "Adventure",
    "rating": 4.7,
    "coverImage": "https://archive.org/services/img/robinsoncrusoe00defo",
    "pdfUrl": "https://archive.org/download/robinsoncrusoe00defo/robinsoncrusoe00defo.pdf"
  },
  {
    "title": "Treasure Island",
    "author": "Robert Louis Stevenson",
    "category": "Adventure",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/treasureisland00stev",
    "pdfUrl": "https://archive.org/download/treasureisland00stev/treasureisland00stev.pdf"
  },
  {
    "title": "Alice's Adventures in Wonderland",
    "author": "Lewis Carroll",
    "category": "Fantasy",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/alicesadventures00carr",
    "pdfUrl": "https://archive.org/download/alicesadventures00carr/alicesadventures00carr.pdf"
  },
  {
    "title": "The Adventures of Sherlock Holmes",
    "author": "Arthur Conan Doyle",
    "category": "Mystery",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/adventuressherl00doylgoog",
    "pdfUrl": "https://archive.org/download/adventuressherl00doylgoog/adventuressherl00doylgoog.pdf"
  },
  {
    "title": "Pride and Prejudice",
    "author": "Jane Austen",
    "category": "Classic",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/prideprejudice00aust",
    "pdfUrl": "https://archive.org/download/prideprejudice00aust/prideprejudice00aust.pdf"
  },
  {
    "title": "Jane Eyre",
    "author": "Charlotte Brontë",
    "category": "Romance",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/janeeyre00bron",
    "pdfUrl": "https://archive.org/download/janeeyre00bron/janeeyre00bron.pdf"
  },
  {
    "title": "Wuthering Heights",
    "author": "Emily Brontë",
    "category": "Classic",
    "rating": 4.5,
    "coverImage": "https://archive.org/services/img/wutheringheights00bron",
    "pdfUrl": "https://archive.org/download/wutheringheights00bron/wutheringheights00bron.pdf"
  },
  {
    "title": "Great Expectations",
    "author": "Charles Dickens",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/greatexpectation00dick",
    "pdfUrl": "https://archive.org/download/greatexpectation00dick/greatexpectation00dick.pdf"
  },
  {
    "title": "A Tale of Two Cities",
    "author": "Charles Dickens",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/taleoftwocities00dick",
    "pdfUrl": "https://archive.org/download/taleoftwocities00dick/taleoftwocities00dick.pdf"
  },
  {
    "title": "Les Misérables",
    "author": "Victor Hugo",
    "category": "Classic",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/lesmiserables00hugo",
    "pdfUrl": "https://archive.org/download/lesmiserables00hugo/lesmiserables00hugo.pdf"
  },
  {
    "title": "War and Peace",
    "author": "Leo Tolstoy",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/warpeace00tols",
    "pdfUrl": "https://archive.org/download/warpeace00tols/warpeace00tols.pdf"
  },
  {
    "title": "Crime and Punishment",
    "author": "Fyodor Dostoevsky",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/crimepunishment00dosto",
    "pdfUrl": "https://archive.org/download/crimepunishment00dosto/crimepunishment00dosto.pdf"
  }
];

const seed = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB...");
        
        await Book.deleteMany({});
        console.log("Cleared existing books.");
        
        const books = realBooks.map(book => ({
            ...book,
            description: `${book.title} by ${book.author}. A masterpiece of ${book.category.toLowerCase()}.`,
            price: 0,
            pages: 350,
            publishedDate: "19th Century"
        }));
        
        await Book.insertMany(books);
        console.log(`Successfully seeded ${books.length} real books into the database!`);
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seed();
