import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookCard from './components/BookCard';
import Pagination from './components/Pagination';
import { Loader2, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { API_BASE_URL } from './config';
import AnnouncementBar from './components/AnnouncementBar';
import BookSlider from './components/BookSlider';
import Chatbot from './components/Chatbot';
import SubscriptionBox from './components/SubscriptionBox';
import LiveAd from './components/LiveAd';
import ResearchPapers from './pages/ResearchPapers';
import Login from './pages/Login';
import Admin from './pages/Admin';
import UserDashboard from './pages/UserDashboard';
import Community from './pages/Community';
import Docs from './pages/Docs';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4 } }
};

const App = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  const categories = ['All', 'Classic', 'Mystery', 'Horror', 'Fantasy', 'Philosophy', 'Adventure', 'Sci-Fi', 'Romance'];

  const fetchBooks = async (page, query = '', category = 'All') => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/books?page=${page}&limit=8&category=${category}`;
      if (query) {
        url = `${API_BASE_URL}/api/books/search?q=${query}&page=${page}&limit=8&category=${category}`;
      }
      
      const res = await axios.get(url, { timeout: 10000 }); // Add 10s timeout
      let fetchedBooks = res.data.books || [];

      // Update images from Google Books if needed (Optimized)
      const googleUpdatedBooks = await Promise.all(fetchedBooks.map(async (book) => {
        if (book.coverImage?.includes('placehold.co') || !book.coverImage) {
          try {
            const gbRes = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(book.title)}&maxResults=1`);
            if (gbRes.data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail) {
              return { ...book, coverImage: gbRes.data.items[0].volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') };
            }
          } catch (e) {}
        }
        return book;
      }));
      
      setBooks(googleUpdatedBooks);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("API Error:", err);
      // Fallback logic for development or when API is down
      setBooks(mockBooks.filter(b => (category === 'All' || b.category === category) && b.title.toLowerCase().includes(query.toLowerCase())));
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks(currentPage, searchQuery, selectedCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, searchQuery, selectedCategory]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 on search
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com"}>
      <AnnouncementBar />
      <Navbar onSearch={handleSearch} />
      <Chatbot />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Hero />
              <BookSlider books={books} />
              <main className="main-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Essential Books</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      {selectedCategory} Collection
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowFilters(true)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.6rem', 
                      background: 'var(--bg-card)', 
                      padding: '0.7rem 1.25rem', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border)',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow)'
                    }}
                  >
                    <Filter size={18} /> Filters
                  </button>
                </div>

                {/* SLIDING FILTER OVERLAY */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 2000,
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}
                      onClick={() => setShowFilters(false)}
                    >
                      <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                          width: '100%',
                          maxWidth: '400px',
                          background: 'var(--bg-card)',
                          height: '100%',
                          padding: '3rem 2rem',
                          boxShadow: '-20px 0 50px rgba(0,0,0,0.1)'
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Search Filters</h3>
                          <button 
                            onClick={() => setShowFilters(false)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
                          >
                            <X size={24} />
                          </button>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                            {categories.map(cat => (
                              <button
                                key={cat}
                                onClick={() => {
                                  setSelectedCategory(cat);
                                  setCurrentPage(1);
                                }}
                                style={{
                                  padding: '0.75rem',
                                  borderRadius: '12px',
                                  border: '1px solid var(--border)',
                                  background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-main)',
                                  color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                                  fontWeight: 600,
                                  fontSize: '0.85rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={() => setShowFilters(false)}
                          style={{
                            width: '100%',
                            padding: '1.1rem',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'var(--text-main)',
                            color: 'var(--bg-card)',
                            fontWeight: 800,
                            marginTop: '2rem',
                            cursor: 'pointer'
                          }}
                        >
                          Apply Filters
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                    <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                  </div>
                ) : (
                  <>
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="book-grid"
                    >
                      {books.length > 0 ? (
                        books.map((book, index) => (
                          <React.Fragment key={book._id || book.id}>
                            <motion.div variants={itemVariants}>
                              <BookCard book={book} />
                            </motion.div>
                            {index === 3 && (
                              <LiveAd 
                                title="Experience Kindle Oasis" 
                                description="Waterproof, warm light, and weeks of battery life. Perfect for summer reading."
                              />
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem' }}>
                          <h3>No books found</h3>
                        </div>
                      )}
                    </motion.div>
                    
                    <Pagination 
                      currentPage={currentPage} 
                      totalPages={totalPages} 
                      onPageChange={(page) => setCurrentPage(page)} 
                    />
                  </>
                )}
                
                
                
                <SubscriptionBox />
              </main>
            </motion.div>
          } />
          <Route path="/login" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {user ? <Navigate to="/" /> : <Login />}
            </motion.div>
          } />
          <Route path="/admin" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {authLoading ? <Loader2 className="animate-spin" /> : user?.role === 'admin' ? <Admin /> : <Navigate to="/" />}
            </motion.div>
          } />
          <Route path="/dashboard" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {authLoading ? <Loader2 className="animate-spin" /> : user ? <UserDashboard /> : <Navigate to="/login" />}
            </motion.div>
          } />
          <Route path="/community" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Community />
            </motion.div>
          } />
          <Route path="/research" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResearchPapers />
            </motion.div>
          } />
          <Route path="/docs" element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Docs />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>

      <footer style={{ 
        marginTop: '5rem', 
        padding: '4rem 2rem', 
        background: 'var(--bg-card)', 
        borderTop: '1px solid var(--border)',
        color: 'var(--text-main)', 
        textAlign: 'center' 
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>BookHaven</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Discover the world's largest library of free digital books. Empowering knowledge for everyone, everywhere.
        </p>
        <div style={{ paddingTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
          &copy; 2026 BookHaven. All rights reserved.
        </div>
      </footer>
    </GoogleOAuthProvider>
  );
};

const mockBooks = [
  {
    "id": "mock1",
    "title": "The Oedipus tyrannus of Sophocles",
    "author": "Sophocles",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/oedipustyrannuso00sophiala",
    "pdfUrl": "https://archive.org/download/oedipustyrannuso00sophiala/oedipustyrannuso00sophiala.pdf"
  },
  {
    "id": "mock2",
    "title": "A general introduction to psychoanalysis",
    "author": "Sigmund Freud",
    "category": "Philosophy",
    "rating": 4.7,
    "coverImage": "https://archive.org/services/img/generalintroduct00freuiala",
    "pdfUrl": "https://archive.org/download/generalintroduct00freuiala/generalintroduct00freuiala.pdf"
  },
  {
    "id": "mock3",
    "title": "Walden: or, Life in the woods",
    "author": "Henry David Thoreau",
    "category": "Philosophy",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/waldenlifewoods00thorrich",
    "pdfUrl": "https://archive.org/download/waldenlifewoods00thorrich/waldenlifewoods00thorrich.pdf"
  },
  {
    "id": "mock4",
    "title": "The Origin of Species",
    "author": "Charles Darwin",
    "category": "Science",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/originofspecies00darwuoft",
    "pdfUrl": "https://archive.org/download/originofspecies00darwuoft/originofspecies00darwuoft.pdf"
  },
  {
    "id": "mock5",
    "title": "The Autobiography of Benjamin Franklin",
    "author": "Benjamin Franklin",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/autobiography00franrich",
    "pdfUrl": "https://archive.org/download/autobiography00franrich/autobiography00franrich.pdf"
  },
  {
    "id": "mock6",
    "title": "Confessions of St. Augustine",
    "author": "Saint Augustine",
    "category": "Philosophy",
    "rating": 4.7,
    "coverImage": "https://archive.org/services/img/confessionsofst00augurich",
    "pdfUrl": "https://archive.org/download/confessionsofst00augurich/confessionsofst00augurich.pdf"
  },
  {
    "id": "mock7",
    "title": "The Odyssey of Homer",
    "author": "Homer",
    "category": "Adventure",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/odyssey00homerich",
    "pdfUrl": "https://archive.org/download/odyssey00homerich/odyssey00homerich.pdf"
  },
  {
    "id": "mock8",
    "title": "The Divine Comedy",
    "author": "Dante Alighieri",
    "category": "Classic",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/divinecomedy00dantuoft",
    "pdfUrl": "https://archive.org/download/divinecomedy00dantuoft/divinecomedy00dantuoft.pdf"
  },
  {
    "id": "mock9",
    "title": "Paradise Lost",
    "author": "John Milton",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/paradiselost00miltuoft",
    "pdfUrl": "https://archive.org/download/paradiselost00miltuoft/paradiselost00miltuoft.pdf"
  },
  {
    "id": "mock10",
    "title": "Faust",
    "author": "Johann Wolfgang von Goethe",
    "category": "Classic",
    "rating": 4.7,
    "coverImage": "https://archive.org/services/img/faust00goetuoft",
    "pdfUrl": "https://archive.org/download/faust00goetuoft/faust00goetuoft.pdf"
  },
  {
    "id": "mock11",
    "title": "The Wealth of Nations",
    "author": "Adam Smith",
    "category": "Philosophy",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/wealthofnations00smituoft",
    "pdfUrl": "https://archive.org/download/wealthofnations00smituoft/wealthofnations00smituoft.pdf"
  },
  {
    "id": "mock12",
    "title": "Meditations",
    "author": "Marcus Aurelius",
    "category": "Philosophy",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/meditations00marc",
    "pdfUrl": "https://archive.org/download/meditations00marc/meditations00marc.pdf"
  },
  {
    "id": "mock13",
    "title": "The Prince",
    "author": "Niccolò Machiavelli",
    "category": "Philosophy",
    "rating": 4.6,
    "coverImage": "https://archive.org/services/img/prince00machuoft",
    "pdfUrl": "https://archive.org/download/prince00machuoft/prince00machuoft.pdf"
  },
  {
    "id": "mock14",
    "title": "Frankenstein",
    "author": "Mary Shelley",
    "category": "Horror",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/frankensteinor00shel",
    "pdfUrl": "https://archive.org/download/frankensteinor00shel/frankensteinor00shel.pdf"
  },
  {
    "id": "mock15",
    "title": "Dracula",
    "author": "Bram Stoker",
    "category": "Horror",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/dracula00stok",
    "pdfUrl": "https://archive.org/download/dracula00stok/dracula00stok.pdf"
  },
  {
    "id": "mock16",
    "title": "Common Sense",
    "author": "Thomas Paine",
    "category": "Philosophy",
    "rating": 4.7,
    "coverImage": "https://archive.org/services/img/commonsense00painiala",
    "pdfUrl": "https://archive.org/download/commonsense00painiala/commonsense00painiala.pdf"
  },
  {
    "id": "mock17",
    "title": "Grimms' Fairy Tales",
    "author": "Jacob and Wilhelm Grimm",
    "category": "Fantasy",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/grimmsfairytales00grim",
    "pdfUrl": "https://archive.org/download/grimmsfairytales00grim/grimmsfairytales00grim.pdf"
  },
  {
    "id": "mock18",
    "title": "Gulliver's Travels",
    "author": "Jonathan Swift",
    "category": "Adventure",
    "rating": 4.6,
    "coverImage": "https://archive.org/services/img/gulliverstravels00swif",
    "pdfUrl": "https://archive.org/download/gulliverstravels00swif/gulliverstravels00swif.pdf"
  },
  {
    "id": "mock19",
    "title": "Robinson Crusoe",
    "author": "Daniel Defoe",
    "category": "Adventure",
    "rating": 4.7,
    "coverImage": "https://archive.org/services/img/robinsoncrusoe00defo",
    "pdfUrl": "https://archive.org/download/robinsoncrusoe00defo/robinsoncrusoe00defo.pdf"
  },
  {
    "id": "mock20",
    "title": "Treasure Island",
    "author": "Robert Louis Stevenson",
    "category": "Adventure",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/treasureisland00stev",
    "pdfUrl": "https://archive.org/download/treasureisland00stev/treasureisland00stev.pdf"
  },
  {
    "id": "mock21",
    "title": "Alice's Adventures in Wonderland",
    "author": "Lewis Carroll",
    "category": "Fantasy",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/alicesadventures00carr",
    "pdfUrl": "https://archive.org/download/alicesadventures00carr/alicesadventures00carr.pdf"
  },
  {
    "id": "mock22",
    "title": "The Adventures of Sherlock Holmes",
    "author": "Arthur Conan Doyle",
    "category": "Mystery",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/adventuressherl00doylgoog",
    "pdfUrl": "https://archive.org/download/adventuressherl00doylgoog/adventuressherl00doylgoog.pdf"
  },
  {
    "id": "mock23",
    "title": "Pride and Prejudice",
    "author": "Jane Austen",
    "category": "Classic",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/prideprejudice00aust",
    "pdfUrl": "https://archive.org/download/prideprejudice00aust/prideprejudice00aust.pdf"
  },
  {
    "id": "mock24",
    "title": "Jane Eyre",
    "author": "Charlotte Brontë",
    "category": "Romance",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/janeeyre00bron",
    "pdfUrl": "https://archive.org/download/janeeyre00bron/janeeyre00bron.pdf"
  },
  {
    "id": "mock25",
    "title": "Wuthering Heights",
    "author": "Emily Brontë",
    "category": "Classic",
    "rating": 4.5,
    "coverImage": "https://archive.org/services/img/wutheringheights00bron",
    "pdfUrl": "https://archive.org/download/wutheringheights00bron/wutheringheights00bron.pdf"
  },
  {
    "id": "mock26",
    "title": "Great Expectations",
    "author": "Charles Dickens",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/greatexpectation00dick",
    "pdfUrl": "https://archive.org/download/greatexpectation00dick/greatexpectation00dick.pdf"
  },
  {
    "id": "mock27",
    "title": "A Tale of Two Cities",
    "author": "Charles Dickens",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/taleoftwocities00dick",
    "pdfUrl": "https://archive.org/download/taleoftwocities00dick/taleoftwocities00dick.pdf"
  },
  {
    "id": "mock28",
    "title": "Les Misérables",
    "author": "Victor Hugo",
    "category": "Classic",
    "rating": 4.9,
    "coverImage": "https://archive.org/services/img/lesmiserables00hugo",
    "pdfUrl": "https://archive.org/download/lesmiserables00hugo/lesmiserables00hugo.pdf"
  },
  {
    "id": "mock29",
    "title": "War and Peace",
    "author": "Leo Tolstoy",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/warpeace00tols",
    "pdfUrl": "https://archive.org/download/warpeace00tols/warpeace00tols.pdf"
  },
  {
    "id": "mock30",
    "title": "Crime and Punishment",
    "author": "Fyodor Dostoevsky",
    "category": "Classic",
    "rating": 4.8,
    "coverImage": "https://archive.org/services/img/crimepunishment00dosto",
    "pdfUrl": "https://archive.org/download/crimepunishment00dosto/crimepunishment00dosto.pdf"
  }
];

export default App;
