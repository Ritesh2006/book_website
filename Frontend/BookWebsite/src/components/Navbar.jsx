import React, { useState, useEffect } from 'react';
import { Search, BookOpen, User, Menu, X, Sun, Moon, Shield, LogOut, Home, Users, LayoutDashboard, FileText } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

import axios from 'axios';

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [searchValue, setSearchValue] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [showRecs, setShowRecs] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val); // This updates App.jsx state instantly

    if (val.length > 1) {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'https://book-website-1.onrender.com'}/api/books/search?q=${val}&limit=5`);
        setRecommendations(res.data.books || []);
        setShowRecs(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setRecommendations([]);
      setShowRecs(false);
    }
  };

  const navLinks = [
    { label: 'Discover', path: '/' },
    { label: 'Dashboard', path: '/dashboard', private: true },
    { label: 'Community', path: '/community' },
    { label: 'Research', path: '/research' },
  ];

  return (
    <>
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        width: '100%',
        background: scrolled ? 'var(--glass)' : 'var(--bg-main)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}>
        {/* Inner Container: Perfectly aligned with App.jsx main layout (1400px, 0 2rem) */}
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          
          {/* Logo Section */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '0.5rem', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              BookHaven
            </span>
          </Link>

          <div className="desktop-only" style={{ 
            flex: 1, 
            maxWidth: '500px', 
            margin: '0 2rem',
            position: 'relative'
          }}>
            <Search size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={() => { if(recommendations.length > 0) setShowRecs(true); }}
              onBlur={() => setTimeout(() => setShowRecs(false), 200)}
              placeholder="Search thousands of free books..." 
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                borderRadius: '50px',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                outline: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                transition: 'border-color 0.3s ease'
              }}
            />
            {/* Recommendation Dropdown */}
            <AnimatePresence>
              {showRecs && recommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    zIndex: 1001,
                    overflow: 'hidden'
                  }}
                >
                  {recommendations.map((book) => (
                    <div 
                      key={book._id}
                      onClick={() => {
                        setSearchValue(book.title);
                        onSearch(book.title);
                        setShowRecs(false);
                      }}
                      style={{
                        padding: '0.75rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {book.coverImage ? (
                        <img 
                          src={book.coverImage} 
                          alt={book.title}
                          style={{ width: '40px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} 
                        />
                      ) : (
                        <BookOpen size={16} color="var(--primary)" />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{book.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{book.author}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Section Navigation */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexShrink: 0 }}>
            
            {/* Desktop Links */}
            <div className="desktop-only" style={{ gap: '1.5rem', alignItems: 'center' }}>
              {navLinks.map((link, idx) => (
                (!link.private || user) && (
                  <Link 
                    key={idx} 
                    to={link.path} 
                    style={{ 
                      color: location.pathname === link.path ? 'var(--text-main)' : 'var(--text-muted)', 
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                    onMouseLeave={(e) => {
                      if(location.pathname !== link.path) e.currentTarget.style.color = 'var(--text-muted)'
                    }}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            <div className="desktop-only" style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>

            {/* Mobile Search Toggle */}
            <button 
              className="mobile-only"
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              style={{ 
                background: 'transparent',
                border: 'none', 
                color: 'var(--text-main)', 
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8
              }}
            >
              <Search size={22} />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              style={{ 
                background: 'transparent',
                border: 'none', 
                color: 'var(--text-main)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8,
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0.8}
            >
              {theme === 'light' ? <Moon size={22} strokeWidth={2} /> : <Sun size={22} strokeWidth={2} />}
            </button>

            {/* Desktop Auth */}
            <div className="desktop-only" style={{ alignItems: 'center', gap: '1rem' }}>
              {user?.role === 'admin' && (
                <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', textDecoration: 'none' }}>
                  <Shield size={16} /> Admin
                </Link>
              )}

              {user ? (
                <button 
                  onClick={handleLogout}
                  style={{ 
                    background: 'transparent', 
                    border: '1px solid var(--border)', 
                    color: 'var(--text-main)', 
                    padding: '0.5rem 1.25rem', 
                    borderRadius: '50px', 
                    fontWeight: 600, 
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-main)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <Link to="/login" style={{ 
                  background: 'var(--text-main)', 
                  color: 'var(--bg-card)', 
                  padding: '0.6rem 1.5rem', 
                  borderRadius: '50px', 
                  fontWeight: 700, 
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="mobile-only">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text-main)', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.25rem'
                }}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* === PREMIUM MOBILE DRAWER === */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="mobile-drawer"
          >
            <div className="mobile-drawer-inner">

              {/* User Card */}
              {user ? (
                <div className="mobile-user-card">
                  <div className="mobile-user-avatar" style={{ overflow: 'hidden', border: user.picture ? '2px solid var(--primary)' : 'none' }}>
                    {user.picture ? (
                      <img src={user.picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                    ) : (
                      user.email[0].toUpperCase()
                    )}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>{user.name || user.email.split('@')[0]}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '50px' }}>ADMIN</span>
                  )}
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1.1rem',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '16px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  marginBottom: '0.5rem'
                }}>
                  <User size={20}/> Sign In to BookHaven
                </Link>
              )}

              <div className="mobile-divider" />

              {/* Nav Links */}
              {[
                { label: 'Discover', path: '/', icon: <Home size={20}/> },
                { label: 'Community', path: '/community', icon: <Users size={20}/> },
                { label: 'Research', path: '/research', icon: <FileText size={20}/> },
                ...(user ? [{ label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20}/> }] : []),
                ...(user?.role === 'admin' ? [{ label: 'Admin Panel', path: '/admin', icon: <Shield size={20}/> }] : []),
              ].map((link, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div style={{ flex: 1 }} />

              <div className="mobile-divider" />

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="mobile-nav-link"
                style={{ border: 'none', width: '100%', justifyContent: 'flex-start', cursor: 'pointer', background: 'none' }}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              </button>

              {user && (
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="mobile-nav-link"
                  style={{ border: 'none', width: '100%', color: '#ef4444', cursor: 'pointer', background: 'none', justifyContent: 'flex-start' }}
                >
                  <LogOut size={20} style={{ color: '#ef4444' }} />
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="mobile-search-overlay"
          >
            <div className="mobile-search-header">
              <div className="mobile-search-input-wrap">
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input
                  type="text"
                  autoFocus
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Search books, authors..."
                />
              </div>
              <button className="mobile-search-close" onClick={() => setIsSearchOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {recommendations.length > 0 ? (
                recommendations.map((book) => (
                  <div
                    key={book._id}
                    className="mobile-search-result"
                    onClick={() => {
                      setSearchValue(book.title);
                      onSearch(book.title);
                      setIsSearchOpen(false);
                    }}
                  >
                    {book.coverImage ? (
                      <img src={book.coverImage} style={{ width: '44px', height: '64px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                    ) : <BookOpen size={24} color="var(--primary)" />}
                    <div>
                      <p style={{ fontWeight: 700, margin: 0 }}>{book.title}</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>{book.author}</p>
                    </div>
                  </div>
                ))
              ) : searchValue.length > 1 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
                  <BookOpen size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p>No matching books found.</p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
                  <Search size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p>Type to discover masterpieces...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === BOTTOM NAVIGATION BAR (Mobile Only) === */}
      <nav className="bottom-nav">
        <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={22} />
          <span>Discover</span>
        </Link>
        <Link to="/community" className={`bottom-nav-item ${location.pathname === '/community' ? 'active' : ''}`}>
          <Users size={22} />
          <span>Community</span>
        </Link>
        {user && (
          <Link to="/dashboard" className={`bottom-nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={22} />
            <span>Dashboard</span>
          </Link>
        )}
        <button
          className="bottom-nav-item"
          onClick={() => setIsSearchOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Search size={22} />
          <span>Search</span>
        </button>
        {!user ? (
          <Link to="/login" className={`bottom-nav-item ${location.pathname === '/login' ? 'active' : ''}`}>
            <User size={22} />
            <span>Sign In</span>
          </Link>
        ) : (
          <button
            className="bottom-nav-item"
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
          >
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        )}
      </nav>
    </>
  );
};

export default Navbar;
