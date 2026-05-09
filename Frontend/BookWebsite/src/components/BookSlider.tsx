import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const BookSlider = ({ books }) => {
  // If no books available yet, use a fallback array to prevent errors.
  const displayBooks = books?.length > 0 ? books : [];

  return (
    <div style={{ margin: '4rem 0', overflow: 'hidden', width: '100%', position: 'relative' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginLeft: '2rem', marginBottom: '1.5rem' }}>🔥 Trending Now</h2>
      
      {/* Container to hide overflow */}
      <div style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', padding: '1rem 0' }}>
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
          style={{ display: 'flex', gap: '2rem', width: 'fit-content', paddingLeft: '2rem' }}
        >
          {/* Duplicate books array to create endless loop effect */}
          {[...displayBooks, ...displayBooks].map((book, index) => (
            <div 
              key={`slide-${book._id || book.id}-${index}`}
              className="premium-card"
              style={{
                minWidth: '220px',
                height: '320px',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              <img 
                src={book.coverImage} 
                alt={book.title} 
                onError={(e) => { e.target.src = 'https://placehold.co/400x600/1e293b/FFFFFF/png?text=' + encodeURIComponent(book.title); }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                padding: '2rem 1rem 1rem',
                color: 'white',
                whiteSpace: 'normal'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <Star fill="#fbbf24" size={12} /> {book.rating || '4.5'}
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>{book.title}</h4>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{book.author}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BookSlider;
