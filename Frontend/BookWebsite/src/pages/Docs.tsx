import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Bot, Users, FileText, HelpCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Docs = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem', minHeight: '80vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>
          Library <span style={{ color: 'var(--primary)' }}>Documentation</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '700px', lineHeight: 1.6 }}>
          Everything you need to know about using BookHaven. Discover how to leverage our robust AI, engage with the community, and access world-class research.
        </p>

        <div style={{ display: 'grid', gap: '3rem' }}>
          
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
                <Bot size={28} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>The Llama 3 AI Librarian</h2>
            </div>
            <div className="premium-card" style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
              <p style={{ lineHeight: 1.7, color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                BookHaven is powered by a fine-tuned version of Meta's Llama 3 AI, accessible from the floating action button in the bottom right of any screen.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Ask for highly specific book recommendations (e.g., "Show me sci-fi books written by female authors in the 1980s").',
                  'Summarize themes or concepts of books you are interested in reading.',
                  'Get immediate help navigating the BookHaven interface.'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    <ChevronRight size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#10b981' }}>
                <Users size={28} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Community Hub</h2>
            </div>
            <div className="premium-card" style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
              <p style={{ lineHeight: 1.7, color: 'var(--text-main)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                The Community tab is our globally synced watering hole for readers.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Share your reviews and thoughts on recently read novels.',
                  'Interact with others by leaving Likes and nested Comments.',
                  'Participate respectfully. Posts violating our code of conduct will be removed by Admin intervention.'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    <ChevronRight size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.75rem', borderRadius: '12px', color: '#ec4899' }}>
                <FileText size={28} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Research Papers</h2>
            </div>
            <div className="premium-card" style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
              <p style={{ lineHeight: 1.7, color: 'var(--text-main)', fontSize: '1.05rem', margin: 0 }}>
                We host a highly curated collection of 30 of the most fundamentally important research documents across Science, Computer Science, Biology, and Deep Learning. Access them via the top "Research" tab to download original PDFs like Einstein's Theory of Relativity or the original Bitcoin whitepaper.
              </p>
            </div>
          </section>

          <section style={{ marginTop: '2rem', padding: '4rem 2rem', background: 'linear-gradient(135deg, var(--text-main) 0%, #374151 100%)', color: 'var(--bg-main)', borderRadius: '32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
             <HelpCircle size={56} style={{ opacity: 0.5, marginBottom: '1.5rem' }} />
             <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>Still need help?</h2>
             <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
               If you can't find what you're looking for, feel free to drop a message in the community forum or ask the AI directly!
             </p>
             <Link to="/community" style={{ background: 'var(--bg-main)', color: 'var(--text-main)', border: 'none', padding: '1.1rem 2.5rem', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', display: 'inline-block', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
               Visit Community
             </Link>
          </section>

        </div>
      </motion.div>
    </div>
  );
};

export default Docs;
