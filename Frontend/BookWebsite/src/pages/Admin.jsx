import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Settings, BarChart, Plus, Trash2, Edit2, X, Check, Search, Save, Package, ShieldCheck, Database, FileText, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [books, setBooks] = useState([]);
  const [papers, setPapers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState({ tourVideoUrl: '' });

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
      // Use allSettled to ensure that even if one request (like settings) fails, others still load
      const results = await Promise.allSettled([
        axios.get(`${API_URL}/api/books?limit=200`, { withCredentials: true }),
        axios.get(`${API_URL}/api/users`, { withCredentials: true }),
        axios.get(`${API_URL}/api/papers`, { withCredentials: true }),
        axios.get(`${API_URL}/api/settings/tourVideoUrl`, { withCredentials: true })
      ]);

      const [bRes, uRes, pRes, sRes] = results;

      if (bRes.status === 'fulfilled') setBooks(bRes.value.data.books || []);
      if (uRes.status === 'fulfilled') setUsers(uRes.value.data || []);
      if (pRes.status === 'fulfilled') setPapers(pRes.value.data || []);
      if (sRes.status === 'fulfilled' && sRes.value.data) {
        setSettings({ tourVideoUrl: sRes.value.data.value });
      }

      setLoading(false);
    } catch (err) {
      console.error("Fetch Data Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (uploading) return;
    try {
      if (activeTab === 'inventory') {
        if (!newBook.pdfUrl) {
          alert('Please provide a PDF URL or upload a file from your device.');
          return;
        }
        if (editingItem) {
          await axios.put(`${API_URL}/api/books/${editingItem._id}`, newBook, { withCredentials: true });
          alert('Book updated!');
        } else {
          await axios.post(`${API_URL}/api/books`, newBook, { withCredentials: true });
          alert('Book added to DB!');
        }
      } else if (activeTab === 'papers') {
        if (!newPaper.pdfUrl) {
          alert('Please provide a PDF URL or upload a file from your device.');
          return;
        }
        if (editingItem) {
          await axios.put(`${API_URL}/api/papers/${editingItem._id}`, newPaper, { withCredentials: true });
          alert('Paper updated!');
        } else {
          await axios.post(`${API_URL}/api/papers`, newPaper, { withCredentials: true });
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
    if (!window.confirm('Are you sure?')) return;
    try {
      if (type === 'book') await axios.delete(`${API_URL}/api/books/${id}`, { withCredentials: true });
      else await axios.delete(`${API_URL}/api/papers/${id}`, { withCredentials: true });
      alert('Deleted successfully');
      fetchData();
    } catch (err) {
      alert('Delete failed');
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

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/settings`, {
        key: 'tourVideoUrl',
        value: settings.tourVideoUrl
      }, { withCredentials: true });
      alert(`Video Updated Successfully!`);
      fetchData();
    } catch (err) {
      console.error("Save error:", err);
      alert(`Failed to update video: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteVideo = async () => {
    if (!window.confirm('Are you sure you want to delete the tour video? This will revert it to the default video.')) return;
    try {
      await axios.post(`${API_URL}/api/settings`, {
        key: 'tourVideoUrl',
        value: ''
      }, { withCredentials: true });
      setSettings(prev => ({ ...prev, tourVideoUrl: '' }));
      alert('Video removed from database. Home page will now show the default video.');
    } catch (err) {
      alert('Failed to delete video');
    }
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
        {['inventory', 'papers', 'users', 'media'].map(tab => (
          <button 
            key={tab} onClick={() => setActiveTab(tab)}
            style={{ background: 'transparent', border: 'none', borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent', padding: '1rem 0.5rem', color: activeTab === tab ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 800, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}
          >
            {tab === 'inventory' ? 'Books' : tab === 'media' ? 'Media' : tab}
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
                  <td>{book.pdfUrl?.substring(0, 15)}...</td>
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

              {activeTab === 'media' && (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem 0' }}>
                    <div style={{ maxWidth: '600px' }}>
                      <h3 style={{ marginBottom: '1.5rem' }}>Media Assets</h3>
                      <form onSubmit={handleUpdateSettings}>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tour Platform Video URL</label>
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input 
                              style={{ ...inputStyle, flex: 1 }} 
                              placeholder="Paste Permanent Video URL (e.g., from Drive or YouTube)" 
                              value={settings.tourVideoUrl} 
                              onChange={e => setSettings({ ...settings, tourVideoUrl: e.target.value })} 
                            />
                            {settings.tourVideoUrl && (
                              <button 
                                type="button"
                                onClick={handleDeleteVideo}
                                disabled={uploading}
                                style={{ background: '#ef444420', color: '#ef4444', border: 'none', padding: '0.85rem', borderRadius: '12px', cursor: 'pointer' }}
                                title="Clear from Database"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                          
                           <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px dashed #10b981', marginBottom: '1rem' }}>
                             <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: '#10b981' }}>
                               ✅ Cloudinary Persistent Storage Active
                             </label>
                             <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                               Your videos are now stored on Cloudinary. They will <strong>NEVER</strong> be deleted during redeployment and will stay online for a lifetime.
                             </p>
                             
                             <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>Upload Video File:</label>
                             <input 
                               type="file" 
                               accept="video/*" 
                               onChange={async (e) => {
                                 const file = e.target.files[0];
                                 if (!file) return;
                                 setUploading(true);
                                 const formData = new FormData();
                                 formData.append('video', file);
                                 try {
                                   const res = await axios.post(`${API_URL}/api/settings/upload-video`, formData, { withCredentials: true });
                                   const newUrl = res.data.url;
                                   
                                   await axios.post(`${API_URL}/api/settings`, {
                                     key: 'tourVideoUrl',
                                     value: newUrl
                                   }, { withCredentials: true });
                                   
                                   setSettings(prev => ({ ...prev, tourVideoUrl: newUrl }));
                                   alert('Video Uploaded to Cloudinary! It is now permanent and will stay through every redeploy.');
                                 } catch (err) {
                                   alert('Upload failed: ' + (err.response?.data?.message || err.message));
                                 } finally {
                                   setUploading(false);
                                 }
                               }} 
                               style={{ background: 'white', color: 'var(--text-main)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', width: '100%' }} 
                             />
                           </div>iv>
                           
                           <button 
                             type="submit"
                             disabled={uploading}
                             style={{ background: 'var(--primary)', color: 'white', padding: '0.8rem 2rem', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
                           >
                             <Save size={18}/> {uploading ? 'Processing...' : (settings.tourVideoUrl ? 'Update Video' : 'Add Video')}
                           </button>
                           <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px dashed #3b82f6', marginBottom: '1rem' }}>
                             <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: '#3b82f6' }}>
                               📚 Bulk Library Sync (Internet Archive)
                             </label>
                             <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                               This will remove all current books and add 100 high-knowledge titles (Philosophy, Science, Classics) with working PDF links.
                             </p>
                             
                             <button 
                               type="button"
                               onClick={async () => {
                                 if (!window.confirm('WARNING: This will delete ALL current books and replace them with 100 new titles. Continue?')) return;
                                 setLoading(true);
                                 try {
                                   await axios.post(`${API_URL}/api/settings/repopulate-books`, {}, { withCredentials: true });
                                   alert('✅ Library Successfully Repopulated with 100 Knowledge Books!');
                                   fetchData();
                                 } catch (err) {
                                   alert('Sync failed: ' + (err.response?.data?.message || err.message));
                                 } finally {
                                   setLoading(false);
                                 }
                               }} 
                               style={{ background: '#3b82f6', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', width: '100%' }}
                             >
                               Sync 100 Knowledge Books
                             </button>
                           </div>
                        </div>
                      </form>
                    </div>
                  </td>
                </tr>
              )}
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
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'block' }}>Book Cover Image</label>
                      <input 
                        value={newBook.coverImage} 
                        onChange={e=>setNewBook({...newBook, coverImage:e.target.value})} 
                        placeholder="Image URL" 
                        style={{ ...inputStyle, marginBottom: '0.5rem' }} 
                      />
                      <input type="file" accept="image/*" onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setUploading(true);
                          const formData = new FormData(); formData.append('image', file);
                          try {
                              const res = await axios.post(`${API_URL}/api/books/upload-cover`, formData, { withCredentials: true });
                              setNewBook(prev => ({...prev, coverImage: res.data.url}));
                              alert('Cover Image Uploaded!');
                          } catch (err) { 
                              alert('Cover upload failed: ' + (err.response?.data?.message || err.message)); 
                          } finally {
                              setUploading(false);
                          }
                      }} style={{ fontSize: '0.75rem' }} />
                    </div>
                    
                    <div style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'block' }}>PDF Source (URL or Device Upload) <span style={{ color: '#ef4444' }}>*</span></label>
                      
                      <input 
                        value={newBook.pdfUrl} 
                        onChange={e=>setNewBook({...newBook, pdfUrl:e.target.value})} 
                        placeholder="Paste PDF Link here..." 
                        style={{ ...inputStyle, marginBottom: '1rem' }} 
                      />

                      <div style={{ position: 'relative', textAlign: 'center', margin: '0.5rem 0 1.5rem' }}>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-card)', padding: '0 1rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>OR UPLOAD FILE</span>
                      </div>

                      <input type="file" accept="application/pdf" onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setUploading(true);
                          const formData = new FormData(); formData.append('pdf', file);
                          try {
                              const res = await axios.post(`${API_URL}/api/books/upload`, formData, { 
                                  withCredentials: true,
                                  onUploadProgress: (progressEvent) => {
                                      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                      console.log(`Upload progress: ${percentCompleted}%`);
                                  }
                              });
                              const finalUrl = res.data.url || res.data.path;
                              setNewBook(prev => ({...prev, pdfUrl: finalUrl}));
                              alert('✅ PDF Uploaded Successfully! You can now click Save.');
                          } catch (err) { 
                              const errorMsg = err.response?.data?.message || err.message;
                              alert('❌ UPLOAD FAILED: ' + errorMsg); 
                          } finally {
                              setUploading(false);
                          }
                      }} style={{ background: 'var(--bg-main)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', width: '100%', fontSize: '0.85rem' }} />
                      {uploading && <small style={{ color: 'var(--primary)', fontWeight: 600 }}>Uploading file, please wait...</small>}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ gridColumn: 'span 2' }}><input required value={newPaper.title} onChange={e=>setNewPaper({...newPaper, title:e.target.value})} placeholder="Paper Title" style={inputStyle} /></div>
                    <div><input required value={newPaper.author} onChange={e=>setNewPaper({...newPaper, author:e.target.value})} placeholder="Author" style={inputStyle} /></div>
                    <div><select value={newPaper.field} onChange={e=>setNewPaper({...newPaper, field:e.target.value})} style={inputStyle}>{fields.map(f=><option key={f}>{f}</option>)}</select></div>
                    <div style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem', display: 'block' }}>PDF Source (URL or Device Upload) <span style={{ color: '#ef4444' }}>*</span></label>
                      
                      <input 
                        value={newPaper.pdfUrl} 
                        onChange={e=>setNewPaper({...newPaper, pdfUrl:e.target.value})} 
                        placeholder="Paste PDF Link here..." 
                        style={{ ...inputStyle, marginBottom: '1rem' }} 
                      />

                      <div style={{ position: 'relative', textAlign: 'center', margin: '0.5rem 0 1.5rem' }}>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-card)', padding: '0 1rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>OR UPLOAD FILE</span>
                      </div>

                      <input type="file" accept="application/pdf" onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setUploading(true);
                          const formData = new FormData(); formData.append('pdf', file);
                          try {
                              const res = await axios.post(`${API_URL}/api/books/upload`, formData, { 
                                  withCredentials: true,
                                  onUploadProgress: (progressEvent) => {
                                      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                      console.log(`Upload progress: ${percentCompleted}%`);
                                  }
                              });
                              const finalUrl = res.data.url || res.data.path;
                              setNewPaper(prev => ({...prev, pdfUrl: finalUrl}));
                              alert('✅ PDF Uploaded Successfully! You can now click Save.');
                          } catch (err) { 
                              const errorMsg = err.response?.data?.message || err.message;
                              alert('❌ UPLOAD FAILED: ' + errorMsg); 
                          } finally {
                              setUploading(false);
                          }
                      }} style={{ background: 'var(--bg-main)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', width: '100%', fontSize: '0.85rem' }} />
                      {uploading && <small style={{ color: 'var(--primary)', fontWeight: 600 }}>Uploading file, please wait...</small>}
                    </div>
                  </>
                )}
                <div style={{ gridColumn: 'span 2' }}>
                  <button type="submit" disabled={uploading} style={{ 
                    width: '100%', 
                    background: uploading ? 'gray' : 'var(--primary)', 
                    color: 'white', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: 'none', 
                    fontWeight: 800,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.7 : 1
                  }}>
                    {uploading ? 'Processing File...' : 'Save to Database'}
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

const inputStyle = { width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' };

export default Admin;

