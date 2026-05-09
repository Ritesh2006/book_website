import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', margin: '3rem 0' }}>
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '0.5rem',
          borderRadius: '10px',
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          opacity: currentPage === 1 ? 0.3 : 1,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <ChevronLeft size={20} />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            border: '1px solid ' + (currentPage === page ? 'var(--primary)' : 'var(--border)'),
            background: currentPage === page ? 'var(--primary)' : 'var(--bg-card)',
            color: currentPage === page ? 'white' : 'var(--text-main)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: currentPage === page ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
          }}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '0.5rem',
          borderRadius: '10px',
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          opacity: currentPage === totalPages ? 0.3 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
