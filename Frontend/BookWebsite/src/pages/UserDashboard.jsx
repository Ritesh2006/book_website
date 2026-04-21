import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Clock, CheckCircle, Star, TrendingUp, Settings, X, Save, ShieldAlert, MessageCircle, Info, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const UserDashboard = () => {
  const { user, checkUser, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  
  // Settings Form State
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    picture: ''
  });

  const [supportData, setSupportData] = useState({
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        picture: user.picture || ''
      });
    }
  }, [user]);

  useEffect(() => {
    checkUser(); // Sync with DB on dashboard enter
  }, []);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://book-website-1.onrender.com';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/users/profile`, profileData);
      alert('Profile updated successfully!');
      checkUser();
      setShowSettings(false);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleSendSupport = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/users/support`, supportData);
      alert(res.data.message || 'Support request sent!');
      setShowSupport(false);
      setSupportData({ subject: '', message: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request. Is the backend running?');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: This will permanently delete your account and all reading progress. Proceed?')) return;
    try {
      await axios.delete(`${API_URL}/api/users/delete-account`);
      alert('Account deleted.');
      logout();
    } catch (err) {
      alert('Failed to delete account');
    }
  };

  const stats = [
    { label: 'Books Read', value: user?.readingProgress?.filter(p => p.status === 'Read').length || 0, icon: <CheckCircle />, color: '#10b981' },
    { label: 'In Progress', value: user?.readingProgress?.filter(p => p.status === 'Reading').length || 0, icon: <Clock />, color: '#6366f1' },
    { label: 'Achievements', value: Math.floor((user?.readingProgress?.length || 0) / 2), icon: <Star />, color: '#f59e0b' },
    { label: 'Join Date', value: new Date(user?.createdAt).toLocaleDateString(), icon: <TrendingUp />, color: '#ec4899' }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary)', overflow: 'hidden', border: '3px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <img src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name || 'U'}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, margin: 0 }}>Welcome back, {user?.name || user?.email?.split('@')[0]}!</h1>
            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0', fontWeight: 500 }}>{user?.bio || 'No bio yet. Update your profile in settings.'}</p>
          </div>
        </div>
        <button onClick={() => setShowSettings(true)} style={settingsBtnStyle}>
          <Settings size={20} /> User Settings
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="premium-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ background: `${stat.color}15`, color: stat.color, padding: '1rem', borderRadius: '12px' }}>{stat.icon}</div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: '2rem' }}>
        {/* LEFT: PROGRESS */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Continue Reading</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {user?.readingProgress?.length > 0 ? (
              user.readingProgress.slice(0, 5).map((progress, i) => {
                const item = progress.bookId || progress.paperId;
                if (!item) return null;
                return (
                  <motion.div key={i} className="premium-card" style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <img src={item.coverImage || 'https://via.placeholder.com/60x90?text=Paper'} style={{ width: '60px', height: '90px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ fontWeight: 800 }}>{item.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.author || item.field}</p>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>{progress.status}</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--bg-main)', borderRadius: '10px' }}>
                        <div style={{ width: `${progress.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: '10px' }} />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '20px' }}>
                <p style={{ color: 'var(--text-muted)' }}>You haven't started reading any books yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: SUPPORT & INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div className="premium-card" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Info size={18}/> Help Desk</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Experiencing issues? Our help desk is operational 24/7 for technical assistance.</p>
              <button onClick={() => setShowSupport(true)} style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Connect to Support</button>
           </div>
           
           <div style={{ padding: '1rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
             <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.75rem' }}>Quick Links</h4>
             <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <li><a href="/docs" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>📚 Platform Documentation</a></li>
               <li><a href="/community" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>💬 Community FAQ</a></li>
             </ul>
           </div>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={modalOverlayStyle}>
             <motion.div initial={{ y: 50 }} animate={{ y: 0 }} style={modalContentStyle}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                 <h2>Profile Settings</h2>
                 <button onClick={() => setShowSettings(false)} style={closeBtnStyle}><X/></button>
               </div>
               <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '1.5rem' }}>
                  <div><label style={labelStyle}>Full Name</label><input style={inputStyle} value={profileData.name} onChange={e=>setProfileData({...profileData, name:e.target.value})} /></div>
                  <div><label style={labelStyle}>Bio</label><textarea style={{...inputStyle, height: '100px'}} value={profileData.bio} onChange={e=>setProfileData({...profileData, bio:e.target.value})} /></div>
                  <div><label style={labelStyle}>Location</label><input style={inputStyle} value={profileData.location} onChange={e=>setProfileData({...profileData, location:e.target.value})} /></div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" style={saveBtnStyle}><Save size={18}/> Save Changes</button>
                    <button type="button" onClick={handleDeleteAccount} style={{ background: '#ef444410', color: '#ef4444', border: 'none', padding: '0.85rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}><ShieldAlert size={18}/> Delete Account</button>
                  </div>
               </form>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUPPORT MODAL */}
      <AnimatePresence>
        {showSupport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={modalOverlayStyle}>
             <motion.div initial={{ y: 50 }} animate={{ y: 0 }} style={modalContentStyle}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                 <h2>Connect to Support</h2>
                 <button onClick={() => setShowSupport(false)} style={closeBtnStyle}><X/></button>
               </div>
               <form onSubmit={handleSendSupport} style={{ display: 'grid', gap: '1.5rem' }}>
                  <div><label style={labelStyle}>Issue Subject</label><input required style={inputStyle} value={supportData.subject} onChange={e=>setSupportData({...supportData, subject:e.target.value})} /></div>
                  <div><label style={labelStyle}>Describe your issue</label><textarea required style={{...inputStyle, height: '150px'}} value={supportData.message} onChange={e=>setSupportData({...supportData, message:e.target.value})} /></div>
                  <button type="submit" style={saveBtnStyle}><MessageCircle size={18}/> Submit Request</button>
               </form>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const settingsBtnStyle = { background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '0.8rem 1.5rem', borderRadius: '14px', color: 'var(--text-main)', display: 'flex', gap: '0.6rem', alignItems: 'center', fontWeight: 700, cursor: 'pointer', boxShadow: 'var(--shadow)' };
const modalOverlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' };
const modalContentStyle = { width: '100%', maxWidth: '600px', background: 'var(--bg-card)', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--border)' };
const closeBtnStyle = { background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' };
const inputStyle = { width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none', fontWeight: 500 };
const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-muted)' };
const saveBtnStyle = { flex: 1, background: 'var(--primary)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' };

export default UserDashboard;
