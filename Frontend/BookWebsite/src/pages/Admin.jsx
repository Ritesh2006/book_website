import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Settings, BarChart, Plus, Trash2, Edit2, X, Check, Search, Save, Package, ShieldCheck, Database, FileText, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [books, setBooks] = useState([]);
  const [papers, setPapers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form States
  const [newBook, setNewBook] = useState({
    title: '', author: '', category: 'Classic', 
    description: '', coverImage: '', pdfUrl: ''
  });

  const [newPaper, setNewPaper] = useState({
    title: '', author: '', field: 'Computer Science', 
    year: '2024', pdfUrl: '', description: ''
  });

  const categories = ['Classic', 'Mystery', 'Horror', 'Fantasy', 'Philosophy', 'Adventure', 'Sci-Fi', 'Romance'];
  const fields = ['Computer Science', 'Machine Learning', 'AI', 'NLP', 'Computer Vision', 'Physics', 'Biology', 'Medicine', 'Cryptography', 'Genetics'];

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://book-website-1.onrender.com';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, uRes, pRes] = await Promise.all([
        axios.get(`${API_URL}/api/books?limit=200`),
        axios.get(`${API_URL}/api/users`),
        axios.get(`${API_URL}/api/papers`)
      ]);
      setBooks(bRes.data.books || []);
      setUsers(uRes.data || []);
      setPapers(pRes.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'inventory') {
        if (editingItem) {
          await axios.put(`${API_URL}/api/books/${editingItem._id}`, newBook);
          alert('Book updated!');
        } else {
          await axios.post(`${API_URL}/api/books`, newBook);
          alert('Book added to DB!');
        }
      } else if (activeTab === 'papers') {
        if (editingItem) {
          await axios.put(`${API_URL}/api/papers/${editingItem._id}`, newPaper);
          alert('Paper updated!');
        } else {
          await axios.post(`${API_URL}/api/papers`, newPaper);
          alert('Paper added to DB!');
        }
      }
      setShowAddModal(false);
      setEditingItem(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed. Is the server online?');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type} from the database permanently?`)) return;
    try {
      const endpoint = type === 'book' ? 'books' : 'papers';
      await axios.delete(`${API_URL}/api/${endpoint}/${id}`);
      alert(`${type} removed from database.`);
      fetchData();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const openEdit = (type, item) => {
    setEditingItem(item);
    if (type === 'book') {
      setNewBook(item);
      setActiveTab('inventory');
    } else {
      setNewPaper(item);
      setActiveTab('papers');
    }
    setShowAddModal(true);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: '#ef444420', color: '#ef4444', padding: '0.4rem', borderRadius: '8px' }}><ShieldCheck size={20}/></div>
            <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Database Authority</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>Superadmin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0' }}>Manage assets, papers, and users with real-time database synchronization.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <motion.button 
             whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
             onClick={() => { setEditingItem(null); setShowAddModal(true); }}
             style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)' }}
          >
            <Plus size={20} /> Add New Asset
          </motion.button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Total Books', value: books.length, icon: <BookOpen />, color: '#6366f1' },
          { label: 'Research Papers', value: papers.length, icon: <FileText />, color: '#f59e0b' },
          { label: 'Registered Users', value: users.length, icon: <Users />, color: '#10b981' },
          { label: 'DB Server', value: 'Active', icon: <Database />, color: '#ef4444' }
        ].map((stat, i) => (
          <motion.div key={i} className="premium-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: `${stat.color}20`, color: stat.color, padding: '1rem', borderRadius: '16px' }}>{stat.icon}</div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900 }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem' }}>
        {['inventory', 'papers', 'users'].map(tab => (
          <button 
            key={tab} onClick={() => setActiveTab(tab)}
            style={{ background: 'transparent', border: 'none', borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent', padding: '1rem 0.5rem', color: activeTab === tab ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 800, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}
          >
            {tab === 'inventory' ? 'Books' : tab}
          </button>
        ))}
      </div>

      {/* MAIN TABLE */}
      <div className="premium-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Manage {activeTab}</h2>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search data..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', outline: 'none', color: 'var(--text-main)' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                {activeTab === 'inventory' && (
                  <><th>Cover</th><th>Details</th><th>Category</th><th>Source</th></>
                )}
                {activeTab === 'papers' && (
                  <><th>Paper Info</th><th>Field</th><th>Year</th><th>Link</th></>
                )}
                {activeTab === 'users' && (
                  <><th>Avatar</th><th>Full Identity</th><th>Access Role</th><th>Joined</th></>
                )}
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* BOOK ROW MAP */}
              {activeTab === 'inventory' && books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())).map(book => (
                <tr key={book._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}><img src={book.coverImage} style={{ width: '40px', borderRadius: '6px' }} /></td>
                  <td style={{ padding: '1rem' }}><strong>{book.title}</strong><br/><small>{book.author}</small></td>
                  <td>{book.category}</td>
                  <td>{book.downloadUrl?.substring(0, 15)}...</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => openEdit('book', book)} style={{ background: 'transparent', border: 'none', color: 'gray', padding: '0.5rem', cursor: 'pointer' }}><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete('book', book._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}

              {/* PAPER ROW MAP */}
              {activeTab === 'papers' && papers.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map(paper => (
                <tr key={paper._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}><strong>{paper.title}</strong><br/><small>{paper.author}</small></td>
                  <td>{paper.field}</td>
                  <td>{paper.year}</td>
                  <td><a href={paper.pdfUrl} target="_blank" style={{ color: 'var(--primary)' }}>PDF <ChevronRight size={12}/></a></td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => openEdit('paper', paper)} style={{ background: 'transparent', border: 'none', color: 'gray', padding: '0.5rem', cursor: 'pointer' }}><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete('paper', paper._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}

              {/* USER ROW MAP */}
              {activeTab === 'users' && users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <img src={u.picture || 'https://via.placeholder.com/30'} style={{ width: '30px', borderRadius: '50%' }} />
                  </td>
                  <td style={{ padding: '1rem' }}><strong>{u.name}</strong><br/><small>{u.email}</small></td>
                  <td><span style={{ padding: '0.2rem 0.6rem', borderRadius: '50px', background: u.role==='admin'?'#ef444410':'#6366f110', color: u.role==='admin'?'#ef4444':'#6366f1', fontSize: '10px', fontWeight: 800 }}>{u.role.toUpperCase()}</span></td>
                  <td>{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                     <button style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.5rem', opacity: u.role==='admin'?0.2:1 }}>Restrict</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FOR ADD/EDIT */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-card)', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                 <h2>{editingItem ? 'Edit Asset' : 'Register New Asset'}</h2>
                 <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'gray', cursor: 'pointer' }}><X/></button>
              </div>

              <form onSubmit={handleAddOrUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {activeTab === 'inventory' ? (
                  <>
                    <div style={{ gridColumn: 'span 2' }}><input required value={newBook.title} onChange={e=>setNewBook({...newBook, title:e.target.value})} placeholder="Title" style={inputStyle} /></div>
                    <div><input required value={newBook.author} onChange={e=>setNewBook({...newBook, author:e.target.value})} placeholder="Author" style={inputStyle} /></div>
                    <div><select value={newBook.category} onChange={e=>setNewBook({...newBook, category:e.target.value})} style={inputStyle}>{categories.map(c=><option key={c}>{c}</option>)}</select></div>
                    <div style={{ gridColumn: 'span 2' }}><input required value={newBook.coverImage} onChange={e=>setNewBook({...newBook, coverImage:e.target.value})} placeholder="Image URL" style={inputStyle} /></div>
                    <div style={{ gridColumn: 'span 2' }}><input required value={newBook.pdfUrl} onChange={e=>setNewBook({...newBook, pdfUrl:e.target.value})} placeholder="PDF Link (e.g. google drive or direct link)" style={inputStyle} /></div>
                  </>
                ) : (
                  <>
                    <div style={{ gridColumn: 'span 2' }}><input required value={newPaper.title} onChange={e=>setNewPaper({...newPaper, title:e.target.value})} placeholder="Paper Title" style={inputStyle} /></div>
                    <div><input required value={newPaper.author} onChange={e=>setNewPaper({...newPaper, author:e.target.value})} placeholder="Author" style={inputStyle} /></div>
                    <div><select value={newPaper.field} onChange={e=>setNewPaper({...newPaper, field:e.target.value})} style={inputStyle}>{fields.map(f=><option key={f}>{f}</option>)}</select></div>
                    <div style={{ gridColumn: 'span 2' }}><input required value={newPaper.pdfUrl} onChange={e=>setNewPaper({...newPaper, pdfUrl:e.target.value})} placeholder="PDF Link" style={inputStyle} /></div>
                  </>
                )}
                <div style={{ gridColumn: 'span 2' }}><button type="submit" style={{ width: '100%', background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: 800 }}>Save to Database</button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' };

export default Admin;

