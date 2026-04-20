import React from 'react';
import { Star, Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const BookCard = ({ book }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      layout
      className="premium-card" 
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ position: 'relative', height: '350px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
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
      
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
          {book.category || 'General'}
        </span>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', lineHeight: 1.3 }}>{book.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>by {book.author}</p>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#10b981' }}>FREE</span>
          </div>
          <motion.button 
            onClick={() => window.open(book.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'var(--text-main)',
              color: 'var(--bg-card)',
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}>
            Read PDF <ExternalLink size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
