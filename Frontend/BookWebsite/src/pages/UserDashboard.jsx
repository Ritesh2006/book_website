import React from 'react';
import { motion } from 'framer-motion';
import { Book, Clock, CheckCircle, Star, TrendingUp, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Books Read', value: '12', icon: <CheckCircle />, color: '#10b981' },
    { label: 'Currently Reading', value: '3', icon: <Clock />, color: '#6366f1' },
    { label: 'Achievements', value: '5', icon: <Star />, color: '#f59e0b' },
    { label: 'Reading Streak', value: '7 Days', icon: <TrendingUp />, color: '#ec4899' }
  ];

  const recentBooks = [
    { title: "The Midnight Library", author: "Matt Haig", progress: "100%", status: "Read", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400" },
    { title: "Atomic Habits", author: "James Clear", progress: "45%", status: "Reading", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400" },
    { title: "Dune", author: "Frank Herbert", progress: "100%", status: "Read", image: "https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&q=80&w=400" }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            background: 'var(--primary)', 
            overflow: 'hidden',
            border: '3px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            {user?.picture ? (
              <img src={user.picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 800 }}>
                {user?.email?.[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, margin: 0 }}>
              Welcome back, {user?.name || user?.email?.split('@')[0]}!
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontWeight: 500 }}>
              Your personal library is fully synchronized.
            </p>
          </div>
        </div>
        <button style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          padding: '0.8rem 1.5rem', 
          borderRadius: '14px', 
          color: 'var(--text-main)', 
          display: 'flex', 
          gap: '0.6rem', 
          alignItems: 'center',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: 'var(--shadow)'
        }}>
          <Settings size={20} /> Dashboard Settings
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card"
            style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
          >
            <div style={{ background: `${stat.color}20`, color: stat.color, padding: '1.25rem', borderRadius: '16px' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: '2rem' }}>
        {/* Left Column: Recent Books */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Continue Reading</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {recentBooks.map((book, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="premium-card"
                style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem' }}
              >
                <img src={book.image} alt={book.title} style={{ width: '90px', height: '130px', borderRadius: '12px', objectFit: 'cover' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{book.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{book.author}</p>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <span>Progress</span>
                      <span style={{ fontWeight: 600 }}>{book.progress}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-main)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: book.progress, height: '100%', background: 'var(--primary)', borderRadius: '10px' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Help Desk & About */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="premium-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)' }}>ℹ️</span> About BookHaven
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              BookHaven is the world's most advanced digital library. Built on modern, open-source technology, our mission is to provide lightning-fast, barrier-free access to classical masterpieces and academic research papers.
            </p>
            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              <strong>Version:</strong> v2.4.0-capacitor<br />
              <strong>Status:</strong> All Systems Operational
            </div>
          </div>

          <div className="premium-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Help Desk</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Need assistance with a PDF, or experiencing synchronization issues on mobile? Our team is here to help.
            </p>
            <button style={{ 
              width: '100%', 
              padding: '1rem', 
              borderRadius: '12px', 
              background: 'var(--primary)', 
              color: 'white', 
              fontWeight: 700, 
              border: 'none', 
              cursor: 'pointer',
              boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)'
            }}>
              Contact Support
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Documentation</a>
              <span style={{ color: 'var(--border)' }}>|</span>
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Community FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
