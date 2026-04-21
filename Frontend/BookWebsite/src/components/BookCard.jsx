import React from 'react';
import { Star, Download, ExternalLink, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book }) => {
  const { user } = useAuth();

  const handleRead = async () => {
    // Open PDF
    const demoPdf = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    window.open(book.pdfUrl || demoPdf, '_blank');
    
    // Record progress if logged in
    if (user && book._id) {
      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'https://book-website-1.onrender.com'}/api/users/reading-progress`, {
          bookId: book._id,
          progress: 50, // Default to 50% when opened
          status: 'Reading'
        });
      } catch (err) {
        console.error("Failed to record progress");
      }
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      layout
      className="premium-card" 
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div className="book-card-image" style={{ position: 'relative', height: '350px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
        <img 
          src={book.coverImage || 'https://placehold.co/400x600/1e293b/FFFFFF/png?text=No+Cover'} 
          alt={book.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x600/1e293b/FFFFFF/png?text=' + encodeURIComponent(book.title);
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        {/* Shine Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transition: 'all 0.5s'
        }} className="card-shine" />
        
        <div 
          className="card-rating-tag"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            padding: '0.4rem 0.6rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.85rem',
            fontWeight: 800,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            color: '#0f172a'
          }}
        >
          <Star size={14} fill="#fbbf24" color="#fbbf24" />
          {book.rating || '4.5'}
        </div>
      </div>
      
      <div className="book-card-content" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
          {book.category || 'General'}
        </span>
        <h3 className="book-title" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', lineHeight: 1.3 }}>{book.title}</h3>
        <p className="book-author" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>by {book.author}</p>
        
        <div className="book-card-footer" style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Price</span>
            <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#10b981', letterSpacing: '-0.5px' }}>FREE</span>
          </div>
          <motion.button 
            className="book-card-button"
            onClick={handleRead}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 25px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
              color: 'white',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.2)'
            }}>
            Read Now <BookOpen size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;

