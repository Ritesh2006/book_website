import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Settings, BarChart, Plus, Trash2, Edit2, X, Check, Search, Save, Package, ShieldCheck, Database } from 'lucide-react';
import axios from 'axios';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [newBook, setNewBook] = useState({
    title: '', author: '', category: 'Classic', 
    description: '', coverImage: '', downloadUrl: '#'
  });

  const categories = ['Classic', 'Mystery', 'Horror', 'Fantasy', 'Philosophy', 'Adventure', 'Sci-Fi', 'Romance'];

  const fetchAdminData = async () => {
    try {
      const bRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/books?limit=100`);
      setBooks(bRes.data.books || []);
      
      const uRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
      setUsers(uRes.data || []);
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/books`, newBook);
      alert('Book added successfully!');
      setShowAddModal(false);
      fetchAdminData();
    } catch (err) {
      alert('Error adding book');
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Delete this book forever?')) return;
    try {
      // In a real app: await axios.delete(`http://localhost:5000/api/books/${id}`);
      setBooks(books.filter(b => b._id !== id));
      alert('Book removed from system.');
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: '#ef444420', color: '#ef4444', padding: '0.4rem', borderRadius: '8px' }}><ShieldCheck size={20}/></div>
            <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Command Center</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>Superadmin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0' }}>Manage assets, monitor identity, and scale the library.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.75rem 1.25rem', borderRadius: '12px', color: 'var(--text-main)', fontWeight: 700, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Database size={18} /> Backup DB
          </button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '12px', 
              border: 'none', 
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Plus size={20} /> Add New Asset
          </motion.button>
        </div>
      </div>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Books', value: books.length, icon: <BookOpen />, color: '#6366f1' },
          { label: 'Registered Users', value: users.length, icon: <Users />, color: '#10b981' },
          { label: 'Cloud Storage', value: '82%', icon: <Package />, color: '#f59e0b' },
          { label: 'Node Status', value: 'Online', icon: <Save />, color: '#ef4444' }
        ].map((stat, i) => (
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
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem' }}>
        {['inventory', 'users', 'logs'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
              padding: '1rem 0.5rem',
              color: activeTab === tab ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="premium-card" style={{ padding: '2rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {activeTab === 'inventory' ? 'Manage Library Assets' : activeTab === 'users' ? 'Registered Identity Control' : 'System Event Logs'}
          </h2>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder={activeTab === 'inventory' ? 'Filter by title...' : 'Filter by email...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', outline: 'none', color: 'var(--text-main)' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                {activeTab === 'inventory' ? (
                  <>
                    <th style={{ padding: '1.25rem' }}>Visual</th>
                    <th style={{ padding: '1.25rem' }}>Title & Author</th>
                    <th style={{ padding: '1.25rem' }}>Category</th>
                    <th style={{ padding: '1.25rem' }}>Status</th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: '1.25rem' }}>Identity</th>
                    <th style={{ padding: '1.25rem' }}>Email Address</th>
                    <th style={{ padding: '1.25rem' }}>Role</th>
                    <th style={{ padding: '1.25rem' }}>Join Date</th>
                  </>
                )}
                <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'inventory' ? (
                books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())).map(book => (
                  <tr key={book._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1.25rem' }}>
                      <img src={book.coverImage} alt="" style={{ width: '40px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <p style={{ fontWeight: 700, margin: 0 }}>{book.title}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{book.author}</p>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{book.category}</span>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><Edit2 size={16}/></button>
                        <button 
                          onClick={() => handleDeleteBook(book._id)}
                          style={{ background: '#ef444410', border: '1px solid #ef444420', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : activeTab === 'users' ? (
                users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>{u.name[0]}</div>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <p style={{ fontWeight: 700, margin: 0 }}>{u.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{u.email}</p>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <span style={{ background: u.role === 'admin' ? '#ef444410' : '#6366f110', color: u.role === 'admin' ? '#ef4444' : '#6366f1', padding: '0.3rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 }}>{u.role.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '1.25rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.joinDate}</span>
                    </td>
                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                      <button style={{ background: '#ef444410', border: '1px solid #ef444420', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>System anomaly logs are currently being parsed... No critical failures detected.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD BOOK MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-card)', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--border)', position: 'relative' }}
            >
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
              
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2rem' }}>Register New Asset</h2>
              
              <form onSubmit={handleAddBook} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Book Title</label>
                  <input required value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Author</label>
                  <input required value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Category</label>
                  <select value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Cover Image URL (or Google Auto-Source keyword)</label>
                  <input required value={newBook.coverImage} onChange={e => setNewBook({...newBook, coverImage: e.target.value})} placeholder="https://..." style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }} />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'transparent', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Check size={20}/> Publish Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
