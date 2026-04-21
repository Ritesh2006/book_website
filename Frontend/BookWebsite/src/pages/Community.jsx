import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Heart, Share2, Plus, Hash, X, Image, Globe, Settings, Bell, Shield, UserCheck, ChevronRight, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Community = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeSettingsTab, setActiveSettingsTab] = useState('notifications');
  const [settings, setSettings] = useState({
    notifications: { newPosts: true, likes: true, comments: false, mentions: true },
    privacy: { publicProfile: true, showActivity: false },
    display: { compactMode: false, showTags: true }
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'https://book-website-1.onrender.com'}/api/posts`);
      setPosts(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = (id) => {
    setPosts(posts.map(post => post._id === id
      ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
      : post
    ));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    const postData = {
      user: user?.name || "Anonymous",
      email: user?.email,
      avatar: (user?.name || "A")[0].toUpperCase(),
      content: newPostContent,
      tags: ["NewPost"]
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'https://book-website-1.onrender.com'}/api/posts`, postData);
      setNewPostContent('');
      setShowCreateModal(false);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (content) => {
    if (navigator.share) {
      navigator.share({ title: 'BookHaven Community', text: content, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: '46px', height: '26px',
        borderRadius: '50px',
        background: value ? 'var(--primary)' : 'var(--border)',
        border: 'none', cursor: 'pointer',
        position: 'relative', transition: 'background 0.25s ease', flexShrink: 0
      }}
    >
      <span style={{
        position: 'absolute', top: '3px',
        left: value ? '22px' : '3px',
        width: '20px', height: '20px',
        borderRadius: '50%', background: 'white',
        transition: 'left 0.25s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
      }} />
    </button>
  );

  const settingsTabs = [
    { id: 'notifications', label: 'Notifications', icon: <Bell size={17} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={17} /> },
    { id: 'display', label: 'Display', icon: <UserCheck size={17} /> },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
            Community Feed
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.4rem 0 0', fontSize: '0.95rem' }}>
            Discuss your favourite books with readers worldwide.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Settings Button — now fully working */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowSettingsModal(true)}
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              padding: '0.7rem 1.2rem',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Settings size={17} /> Settings
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '0.7rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)'
            }}
          >
            <Plus size={18} /> Create Post
          </motion.button>
        </div>
      </div>

      {/* Main grid */}
      <div className="community-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>

        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.length === 0 && !loading && (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
              <MessageSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1.2rem' }}>No Posts Yet</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Be the first to share your thoughts with the community!</p>
            </div>
          )}
          {posts.map((post) => (
            <motion.div
              key={post._id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card community-card"
              style={{ padding: '1.75rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.1rem' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                  background: post.user === "You" ? 'var(--text-main)' : 'var(--primary)',
                  color: post.user === "You" ? 'var(--bg-card)' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.85rem',
                  overflow: 'hidden'
                }}>
                  {post.user === "You" && user?.picture ? (
                    <img src={user.picture} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                  ) : post.avatar}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{post.user}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{post.time}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.97rem', lineHeight: 1.65, marginBottom: '1.1rem', color: 'var(--text-main)' }}>
                {post.content}
              </p>

              {settings.display.showTags && (
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '0.2rem 0.7rem', borderRadius: '50px',
                      background: 'rgba(99,102,241,0.08)', color: 'var(--primary)',
                      fontSize: '0.72rem', fontWeight: 700
                    }}>#{tag}</span>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', gap: '2rem' }}>
                <button
                  onClick={() => handleLike(post._id)}
                  style={{
                    background: 'transparent', border: 'none', display: 'flex', alignItems: 'center',
                    gap: '0.45rem', color: post.isLiked ? '#ef4444' : 'var(--text-muted)',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s'
                  }}>
                  <Heart size={18} fill={post.isLiked ? "#ef4444" : "none"} /> {post.likes}
                </button>
                <button style={{
                  background: 'transparent', border: 'none', display: 'flex', alignItems: 'center',
                  gap: '0.45rem', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem'
                }}>
                  <MessageSquare size={18} /> {post.comments}
                </button>
                <button
                  onClick={() => handleShare(post.content.substring(0, 40))}
                  style={{
                    background: 'transparent', border: 'none', display: 'flex', alignItems: 'center',
                    gap: '0.45rem', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem'
                  }}>
                  <Share2 size={18} /> Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="premium-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Hash size={18} color="var(--primary)" /> Trending Now
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[['SciFiSunday', '82k'], ['DailyReads', '64k'], ['FreeKnowledge', '51k'], ['Classics', '38k']].map(([topic, count]) => (
                <div key={topic} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>#{topic}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 500 }}>{count} posts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--primary)" /> Active Readers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[['Alice Reader', 'AR', '124 posts'], ['BookWorm99', 'BW', '89 posts'], ['LitNerd', 'LN', '56 posts']].map(([name, avatar, stat]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{avatar}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>{name}</p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stat}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===================== CREATE POST MODAL ===================== */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          >
            <motion.div
              initial={{ scale: 0.93, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 30 }}
              style={{ width: '100%', maxWidth: '520px', background: 'var(--bg-card)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--border)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Create a Post</h2>
                <button onClick={() => setShowCreateModal(false)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}><X size={20} /></button>
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What are you reading today?"
                style={{ width: '100%', height: '140px', padding: '1.1rem', borderRadius: '14px', background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem', marginBottom: '1.25rem', resize: 'none', lineHeight: 1.6 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)' }}>
                  <Image size={22} style={{ cursor: 'pointer' }} onClick={() => document.getElementById('post-image-upload').click()} />
                  <input type="file" id="post-image-upload" style={{ display: 'none' }} onChange={() => alert('Image selected!')} />
                  <Globe size={22} style={{ cursor: 'pointer' }} onClick={() => { const url = prompt('Enter link to share:'); if (url) setNewPostContent(p => p + '\n' + url); }} />
                </div>
                <button onClick={handleCreatePost} style={{ background: 'var(--primary)', color: 'white', padding: '0.7rem 1.75rem', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}>
                  Post Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== SETTINGS MODAL ===================== */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          >
            <motion.div
              initial={{ scale: 0.93, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 30 }}
              style={{ width: '100%', maxWidth: '560px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden' }}
            >
              {/* Modal Header */}
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(99,102,241,0.1)', padding: '0.5rem', borderRadius: '10px', color: 'var(--primary)' }}><Settings size={20} /></div>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Community Settings</h2>
                </div>
                <button onClick={() => setShowSettingsModal(false)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}><X size={20} /></button>
              </div>

              {/* Tab Buttons */}
              <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
                {settingsTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSettingsTab(tab.id)}
                    style={{
                      flex: 1, padding: '0.9rem 0.5rem', border: 'none', cursor: 'pointer',
                      background: activeSettingsTab === tab.id ? 'var(--bg-card)' : 'transparent',
                      color: activeSettingsTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                      fontWeight: activeSettingsTab === tab.id ? 700 : 500,
                      fontSize: '0.85rem',
                      borderBottom: activeSettingsTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={activeSettingsTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

                    {activeSettingsTab === 'notifications' && Object.entries(settings.notifications).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1rem', borderRadius: '12px', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Receive alerts for {key.toLowerCase().replace(/([A-Z])/g, ' $1')}</p>
                        </div>
                        <Toggle value={val} onChange={(v) => setSettings(s => ({ ...s, notifications: { ...s.notifications, [key]: v } }))} />
                      </div>
                    ))}

                    {activeSettingsTab === 'privacy' && Object.entries(settings.privacy).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1rem', borderRadius: '12px', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Control your {key.toLowerCase().replace(/([A-Z])/g, ' $1')} visibility</p>
                        </div>
                        <Toggle value={val} onChange={(v) => setSettings(s => ({ ...s, privacy: { ...s.privacy, [key]: v } }))} />
                      </div>
                    ))}

                    {activeSettingsTab === 'display' && Object.entries(settings.display).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1rem', borderRadius: '12px', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Toggle {key.toLowerCase().replace(/([A-Z])/g, ' $1')} in the feed</p>
                        </div>
                        <Toggle value={val} onChange={(v) => setSettings(s => ({ ...s, display: { ...s.display, [key]: v } }))} />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div style={{ padding: '1rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button onClick={() => setShowSettingsModal(false)} style={{ padding: '0.65rem 1.5rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                <button onClick={() => setShowSettingsModal(false)} style={{ padding: '0.65rem 1.75rem', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 6px 16px rgba(99,102,241,0.3)' }}>Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
